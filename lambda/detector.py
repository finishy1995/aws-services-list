#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib2
from ssl import SSLError
import boto3
import time
import os

# Set time out time for url get
TIMEOUT = int(os.getenv('timeout'))
# Set default region because some services end_point omit it
DEFAULT_REGION = 'us-east-1'
# Set DynamoDB Table Name
TABLE_NAME = os.getenv('dynamodb_table')

def check_service_one_region_status(endpoint, region):
    urllib2.socket.setdefaulttimeout(TIMEOUT)
    url = endpoint.replace('**', region['id'])
    if region.has_key('suffix'):
        url = url + region['suffix']
    req = urllib2.Request(url)

    try:
        response = urllib2.urlopen(req, timeout = TIMEOUT)
    except SSLError:
        return False
    except urllib2.socket.timeout, e:
        return False
    except urllib2.HTTPError, e:
        return True
    except urllib2.URLError, e:
        if region['id'] == DEFAULT_REGION:
            url = endpoint.replace('**.', '')
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


def store_data_to_dynamodb(service, region, status):
    key = service.replace(' ', '').lower() + '-' + region['id'].replace('-', '')
    client = boto3.client('dynamodb')
    
    query_flag = client.query(
        TableName = TABLE_NAME,
        KeyConditionExpression = "id = :id_value",
        ExpressionAttributeValues = {
            ":id_value": {"S": key}
        }
    )

    if ((query_flag['Count'] == 0) or ((query_flag['Items'][0]['status']['N'] == '0') and status)):
        put_flag = client.put_item(
            TableName = TABLE_NAME,
            Item = {
                'id': {
                    'S': key
                },
                'service': {
                    'S': service
                },
                'region': {
                    'S': region['id']
                },
                'status': {
                    'N': str(int(status))
                }
            }
        )


def lambda_handler(event, context):
    boolean = check_service_one_region_status(event['endpoint'], event['region'])
    store_data_to_dynamodb(event['service'], event['region'], boolean)

    return "Done."
