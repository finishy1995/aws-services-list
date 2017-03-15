#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib2
import re
import boto3

TABLE_NAME = "aws-services-status"
TABLE_REGIONS = "aws-regions"
SCAN_ID = '11'

def get_region_id_by_region_name(name):
    client = boto3.client('dynamodb')
    response = client.scan(
        TableName = TABLE_REGIONS,
        ScanFilter = {
            'en_name': {
                'AttributeValueList': [
                    {
                        'S': name
                    }
                ],
                'ComparisonOperator': 'EQ'
            }
        }
    )

    return response['Items'][0]['region_id']['S']

def crawler_data_from_AWS():
    url = r"https://aws.amazon.com/en/about-aws/global-infrastructure/regional-product-services/"
    groups_exp = r"<tr>[\s\S]*?<\/tr>"
    contain_exp = r">[^ \f<]{1}[^<]+"

    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    page_contents = response.read()

    groups = re.findall(groups_exp, page_contents, re.I)

    contain = []
    for tr in groups:
        contain.append(re.findall(contain_exp, tr))

    services_info = {}
    regions = []
    for i in range(0, len(contain)):
        if (len(contain[i]) == 0):
            continue
        if (contain[i][0] == ">Edge Locations"):
            break
        if (contain[i][0] == ">Services Offered:"):
            regions = []
            for j in range(1, len(contain[i])):
                regions.append(get_region_id_by_region_name(contain[i][j].replace('>', '', 1)))
        else:
            service = contain[i][0].replace('>', '', 1)
            if (not(service in services_info)):
                services_info[service] = {}
            for j in range(1, len(contain[i])):
                # AWS Website Bug
                if ((contain[i][0] == ">AWS OpsWorks Stacks") and (regions[0] != "eu-west-1") and (j == 1)):
                    continue
                # AWS Website Bug
                if ((contain[i][0] == ">AWS OpsWorks Stacks") and (regions[0] != "eu-west-1")):
                    if (contain[i][j] == ">&nbsp;"):
                        services_info[service].setdefault(regions[j-2], 0)
                    else:
                        services_info[service].setdefault(regions[j-2], 1)
                    continue
                # AWS Website Bug
                if ((contain[i][0] == ">AWS OpsWorks for Chef Automate") and (regions[0] == "ap-southeast-1") and (j == 1)):
                    continue
                # AWS Website Bug
                if ((contain[i][0] == ">AWS OpsWorks for Chef Automate") and (regions[0] == "ap-southeast-1")):
                    if (contain[i][j] == ">&nbsp;"):
                        services_info[service].setdefault(regions[j-2], 0)
                    else:
                        services_info[service].setdefault(regions[j-2], 1)
                    continue
                # AWS Website Bug
                if ((contain[i][0] == ">AWS Personal Health Dashboard") and (regions[0] == "ap-southeast-1") and (j == 1)):
                    continue
                # AWS Website Bug
                if ((contain[i][0] == ">AWS Personal Health Dashboard") and (regions[0] == "ap-southeast-1")):
                    if (contain[i][j] == ">&nbsp;"):
                        services_info[service].setdefault(regions[j-2], 0)
                    else:
                        services_info[service].setdefault(regions[j-2], 1)
                    continue

                if (contain[i][j] == ">&nbsp;"):
                    services_info[service].setdefault(regions[j-1], 0)
                else:
                    services_info[service].setdefault(regions[j-1], 1)

    return services_info

def scan_data_from_dynamoDB(scan_id):
    client = boto3.client('dynamodb')
    response = client.scan(
        TableName = TABLE_NAME,
        ScanFilter = {
            'id': {
                'AttributeValueList': [
                    {
                        'N': scan_id
                    }
                ],
                'ComparisonOperator': 'EQ'
            }
        }
    )

    return response

def compare_data_and_show_diff(crawler_data, scan_data):
    print "The following will show the difference between AWS Website and DynamoDB data:"
    for i in range(0, scan_data['Count']):
        service = scan_data['Items'][i]['service']['S']
        if (not(service in crawler_data)):
            print "Service: ", service
            continue
        for j in range(0, 16):
            region = scan_data['Items'][i]['regions_info']['M']['region'+str(j)]['S']
            # AWS Website Bug
            if (not(region in crawler_data[service])):
                print "Service: ", service, "  Region: ", region
                continue
            if (int(scan_data['Items'][i]['regions_info']['M']['status'+str(j)]['N']) != crawler_data[service][region]):
                print "Service: ", service, "  Region: ", region, "  DynamoDB data:", scan_data['Items'][i]['regions_info']['M']['status'+str(j)]['N'], "  AWS website:", crawler_data[service][region]
    print "------------------------------------------------------------------------------------------------"


    return 0


compare_data_and_show_diff(crawler_data_from_AWS(), scan_data_from_dynamoDB(SCAN_ID))

