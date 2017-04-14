#!/usr/bin/python
# -*- coding: utf8 -*-

import json
import boto3

# Set Lambda function name
LAMBDA_NAME = 'aws-services-list-detector'

def check_all_services_status(min_range, max_range):
    with open('data.json') as json_input:
        data = json.load(json_input)

    client = boto3.client('lambda') 
    min_r = int(min_range)
    max_r = min(len(data['services']), int(max_range))
    region_r = len(data['regions'])
    
    for i in range(min_r, max_r):
        for j in range(0, region_r):
            detector = {}
            detector['service'] = data['services'][i]['name']
            detector['endpoint'] = data['services'][i]['end_point']
            detector['region'] = data['regions'][j]

            detector_json = json.dumps(detector, sort_keys=True, separators=(',', ': '))

            client.invoke(
                FunctionName = LAMBDA_NAME,
                InvocationType = 'Event',
                Payload = detector_json
            )


def lambda_handler(event, context):
    check_all_services_status(event['min_services'], event['max_services'])
    
    return "Done."

# Lambda do not need this
# lambda_handler(0, 0)
