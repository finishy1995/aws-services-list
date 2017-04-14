#!/usr/bin/python
# -*- coding: utf8 -*-

import json
import boto3
import time

TABLE_NAME = 'aws-services-list'
WEBSITE_BUCKET = 'aws-status-check-website'


def update_json_file_to_s3():
    client = boto3.client('dynamodb')

    response = client.scan(
        TableName = TABLE_NAME,
        Select = 'SPECIFIC_ATTRIBUTES',
        ProjectionExpression = 'service, #r, #s',
        ExpressionAttributeNames = {
            "#r": "region",
            "#s": "status"
        }
    )
    
    response['time'] = int(time.time())
    
    response_json = json.dumps(response, sort_keys=True, separators=(',', ': '))
    file = open('/tmp/data.js', 'w')
    file.write("const SERVICES_STATUS = '"+response_json+"'")
    file.close()

    s3 = boto3.resource('s3')
    s3.Bucket(WEBSITE_BUCKET).upload_file('/tmp/data.js', 'data/services_status.js')

def lambda_handler(event, context):
    update_json_file_to_s3()

    return "Done."

# Lambda do not need this
# lambda_handler(0, 0)

