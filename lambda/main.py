#!/usr/bin/python
# -*- coding: utf8 -*-

import json
import os
import urllib2
from ssl import SSLError
import boto3
import time

# Set TTL time, default 15 days
TTL_TIME = 1296000
# Set time out time for url get
TIMEOUT = 2
# Set default region because some services end_point omit it
DEFAULT_REGION = 'us-east-1'
# Set DynamoDB Table Name
TABLE_NAME = 'aws-services-status'
# Set S3 Website Bucket Name
WEBSITE_BUCKET = 'aws-status-check-website'

def check_service_one_region_status(service, region):
    urllib2.socket.setdefaulttimeout(TIMEOUT)
    url = service['end_point'].replace('**', region['id'])
    if region.has_key('suffix'):
        url = url + region['suffix']
    req = urllib2.Request(url)

    try:
        response = urllib2.urlopen(req, timeout=TIMEOUT)
    except SSLError:
        return False
    except urllib2.socket.timeout, e:
        return False
    except urllib2.HTTPError, e:
        return True
    except urllib2.URLError, e:
        if region['id'] == DEFAULT_REGION:
            url = service['end_point'].replace('**.', '')
            req_again = urllib2.Request(url)

            try:
                response = urllib2.urlopen(req_again, timeout = TIMEOUT)
            except urllib2.HTTPError, e:
                return True
            except urllib2.URLError, e:
                return False
            else:
                return True
        else:
            return False
    else:
        return True

def check_all_services_status():
    with open('data.json') as json_input:
        data = json.load(json_input)

    client = boto3.client('dynamodb')
    response = client.scan(
        TableName = TABLE_NAME,
        FilterExpression = "id = :id_value AND service = :service_value",
        ExclusiveStartKey = {
            "id": {"N": "0"},
            "service": {"S": "AVAILABLE"}
        },
        ExpressionAttributeValues = {
            ":id_value": {"N": "0"},
            ":service_value": {"S": "Latest Update"}
        }
    )
    # TODO: Set judge in id == 0
    index = int(response['Items'][0]['latest']['N']) + 1
    present_time = int(time.time())

    for i in range(int(os.getenv('START_RANGE')), min(int(os.getenv('END_RANGE')), len(data['services']))):
        regions_info = {}
        for j in range(0, len(data['regions'])):
            print i, "  ", j
            region_status = check_service_one_region_status(data['services'][i], data['regions'][j])
            regions_info.setdefault("region"+str(j), {'S': data['regions'][j]['id']})
            regions_info.setdefault("status"+str(j), {'N': str(int(region_status))})
        put_flag = client.put_item(
            TableName = TABLE_NAME,
            Item = {
                'id': {
                    'N': str(index)
                },
                'service': {
                    'S': data['services'][i]['name']
                },
                'regions_info': {
                    'M': regions_info
                },
                'time': {
                    'N': str(present_time)
                },
                'ttl': {
                    'N': str(TTL_TIME + present_time)
                }
            }
        )

    return index

    
def check_all_services_in_dynamodb(index):
    client = boto3.client('dynamodb')

    response_count = client.scan(
        TableName = TABLE_NAME,
        FilterExpression = "id = :id_value AND service = :service_value",
        ExclusiveStartKey = {
            "id": {"N": "0"},
            "service": {"S": "AVAILABLE"}
        },
        ExpressionAttributeValues = {
            ":id_value": {"N": "0"},
            ":service_value": {"S": "Latest Update"}
        }
    )
    count = int(response_count['Items'][0]['progress']['N'])

    if (count == 5):
        put_available_flag = client.put_item(
            TableName = TABLE_NAME,
            Item = {
                'id': {
                    'N': str(index)
                },
                'service': {
                    'S': "AVAILABLE"
                },
                'ttl': {
                    'N': str(TTL_TIME + int(time.time()))
                }
            }
        )
        update_flag = client.put_item(
            TableName = TABLE_NAME,
            Item = {
                'id': {
                    'N': '0'
                },
                'service': {
                    'S': 'Latest Update'
                },
                'latest': {
                    'N': str(index)
                },
                'progress': {
                    'N': '0'
                }
            }
        )
        update_json_file_to_s3(index)
    else:
        update_flag = client.put_item(
            TableName = TABLE_NAME,
            Item = {
                'id': {
                    'N': '0'
                },
                'service': {
                    'S': 'Latest Update'
                },
                'latest': {
                    'N': str(index - 1)
                },
                'progress': {
                    'N': str(count + 1)
                }
            }
        )



def update_json_file_to_s3(index):
    client = boto3.client('dynamodb')

    response = client.scan(
        TableName = TABLE_NAME,
        FilterExpression = "id = :id_value",
        ExclusiveStartKey = {
            "id": {"N": str(index)},
            "service": {"S": "AVAILABLE"}
        },
        ExpressionAttributeValues = {
            ":id_value": {"N": str(index)}
        }
    )
    
    response_json = json.dumps(response, sort_keys=True, separators=(',', ': '))
    file = open('/tmp/data.js', 'w')
    file.write("const SERVICES_STATUS = '"+response_json+"'")
    file.close()

    s3 = boto3.resource('s3')
    s3.Bucket(WEBSITE_BUCKET).upload_file('/tmp/data.js', 'data/services_status.js')

def lambda_handler(event, context):
    # Check all AWS services at all recorded regions status
    index = check_all_services_status()
    check_all_services_in_dynamodb(index)
    
    return "Done."

# Lambda do not need this
# lambda_handler(0, 0)

