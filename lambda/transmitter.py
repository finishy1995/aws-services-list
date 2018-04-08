#!/usr/bin/python
# -*- coding: utf8 -*-

import json
import boto3
import time
import os

TABLE_NAME = os.getenv('dynamodb_table')
WEBSITE_BUCKET = os.getenv('bucket')


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
    flag = response.has_key('LastEvaluatedKey')
    items = response['Items']
    count = response['Count']

    while (flag):
        response = client.scan(
            TableName = TABLE_NAME,
            Select = 'SPECIFIC_ATTRIBUTES',
            ProjectionExpression = 'service, #r, #s',
            ExpressionAttributeNames = {
                "#r": "region",
                "#s": "status"
            },
            ExclusiveStartKey = response['LastEvaluatedKey']
        )

        items = items + response['Items']
        flag = response.has_key('LastEvaluatedKey')
        count += response['Count']
    
    response = {'Items': items, 'time': int(time.time()), 'Count': count}
    response_json = json.dumps(response, sort_keys=True, separators=(',', ': '))
    file = open('/tmp/data.json', 'w')
    file.write(response_json)
    file.close()

    s3 = boto3.resource('s3')
    s3.Bucket(WEBSITE_BUCKET).upload_file('/tmp/data.json', 'data/servicesStatus.json')

def lambda_handler(event, context):
    update_json_file_to_s3()

    return "Done."
