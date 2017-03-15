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
        ScanFilter = {
            'id': {
                'AttributeValueList': [
                    {
                        'N': '0'
                    }
                ],
                'ComparisonOperator': 'EQ'
            }
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

    # TODO: Scan DynamoDB to make sure all services updated already
    if len(data['services']) <= int(os.getenv('END_RANGE')):
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
                    'N': str(TTL_TIME + present_time)
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
                }
            }
        )

def lambda_handler(event, context):
    # Check all AWS services at all recorded regions status
    check_all_services_status()
    
    return "Done."

# Lambda do not need this
# lambda_handler(0, 0)

