/// <reference types="aws-sdk" />

const SERVICES_GROUP_JSON = '{"计算":["AWS Batch","AWS Elastic Beanstalk","AWS Elastic Beanstalk Health Service","AWS Lambda","Amazon EC2 Container Registry (ECR)","Amazon EC2 Container Service (ECS)","Amazon Elastic Compute Cloud (EC2)","Amazon Lightsail","Auto Scaling"],"存储":["AWS Storage Gateway","Amazon Elastic File System (EFS)","Amazon Glacier","Amazon Simple Storage Service (S3)"],"数据库":["Amazon DynamoDB","Amazon DynamoDB Streams","Amazon ElastiCache","Amazon Redshift","Amazon Relational Database Service (RDS)","Amazon SimpleDB"],"网站和内容分发":["AWS Direct Connect","Amazon Virtual Private Cloud (VPC)","Elastic Load Balancing"],"迁移":["AWS Database Migration Service","AWS Snowball"],"开发人员工具":["AWS CodeBuild","AWS CodeCommit","AWS CodeDeploy","AWS CodePipeline","AWS X-Ray"],"管理工具":["AWS CloudFormation","AWS CloudTrail","AWS Config","AWS OpsWorks Stacks","AWS OpsWorks for Chef Automate","AWS Service Catalog","Amazon CloudWatch","Amazon CloudWatch Events","Amazon CloudWatch Logs","Amazon EC2 Systems Manager"],"安全、身份与合规":["AWS Certificate Manager","AWS CloudHSM","AWS Directory Service","AWS Key Management Service","AWS Organizations","AWS STS","AWS WAF","Amazon Inspector"],"分析":["AWS Data Pipeline","Amazon Athena","Amazon CloudSearch","Amazon Elastic MapReduce","Amazon Elasticsearch Service","Amazon Kinesis Analytics","Amazon Kinesis Firehose","Amazon Kinesis Streams"],"人工智能":["Amazon Lex","Amazon Machine Learning","Amazon Polly","Amazon Rekognition"],"物联网":["AWS IoT"],"游戏开发":["Amazon GameLift"],"移动服务":["AWS Device Farm","Amazon Cognito Federated Identities","Amazon Cognito Sync","Amazon Cognito Your User Pools","Amazon Mobile Analytics","Amazon Pinpoint"],"应用程序服务":["AWS Step Functions","Amazon API Gateway","Amazon Elastic Transcoder","Amazon Simple Workflow Service (SWF)"],"消息":["Amazon Simple Email Service (SES)","Amazon Simple Notification Service (SNS)","Amazon Simple Queue Service (SQS)","Amazon Simple Queue Service (SQS) Legacy"],"企业生产力":["Amazon WorkMail"],"桌面和应用串流":["Amazon AppStream","Amazon AppStream 2.0","Amazon WorkSpaces"]}'
const ACCESS_KEY_ID = "AKIAIIY24PDBLEXSFNAQ"
const SECRET_ACCESS_KEY = "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"
const REGION = "ap-northeast-1"
const REGION_NUMBER = 16
const TABLE_NAME = "aws-services-status"
const TABLE_REGIONS = "aws-regions"
const DEFAULT_CHECKED_REGION = ["us-east-1", "us-east-2", "us-west-1", "us-west-2", "cn-north-1"]
const MAX_SELECTED_REGION = 7;

var services_status = []
var regions_info = []

window.onload = function() {
	AWS.config = new AWS.Config({
		"accessKeyId": ACCESS_KEY_ID,
		"secretAccessKey": SECRET_ACCESS_KEY,
		"region": REGION
	});

	get_all_services_status_and_regions_info();
}


function get_all_services_status_and_regions_info() {
	if (regions_info.length == 0) get_regions_info_from_dynamoDB();
	if (services_status.length == 0) get_latest_id_from_dynamoDB();
}

function get_latest_id_from_dynamoDB() {
	var dynamodb = new AWS.DynamoDB({region: REGION});

	var scan_latest_id = {
		TableName: TABLE_NAME,
		FilterExpression: "id = :id_value AND service = :service_value",
		ProjectionExpression: "id, service, latest",
		ExclusiveStartKey: {
			"id": {"N": "0"},
			"service": {"S": "AVAILABLE"}
		},
		ExpressionAttributeValues: {
			":id_value": {"N": "0"},
			":service_value": {"S": "Latest Update"}
		}
	};
	dynamodb.scan(scan_latest_id, function (err, data) {
		if (err)
			console.log(err, err.stack);
		else
			get_all_services_status_from_dynamoDB(data.Items[0].latest.N);
	});
}

function get_all_services_status_from_dynamoDB(latest_id) {
	var dynamodb = new AWS.DynamoDB({region: REGION});

	var scan_services_status = {
		TableName: TABLE_NAME,
		FilterExpression: "id = :id_value",
		ExclusiveStartKey: {
			"id": {"N": latest_id},
			"service": {"S": "AVAILABLE"}
		},
		ExpressionAttributeValues: {
			":id_value": {"N": latest_id}
		}
	};
	dynamodb.scan(scan_services_status, function (err, services_data) {
		if (err)
			console.log(err, err.stack);
		else {
			store_services_status(services_data);
			load_current_status_time(services_data.Items[0].time.N);
			reload_services_status();
			create_download_csv_file_button();
		}
	});
}

function get_regions_info_from_dynamoDB() {
	var dynamodb = new AWS.DynamoDB({region: REGION});

	var scan_regions_info = {
		TableName: TABLE_REGIONS
	};
	dynamodb.scan(scan_regions_info, function (err, regions_data) {
		if (err)
			console.log(err, err.stack);
		else {
			store_regions_info(regions_data);
			show_regions_checkbox();
		}
	});
}

function store_services_status(services_data) {
	var region_key;
	var status_key;
	console.log("The following will be an array which store every services status in every region:");

	for (var i = 0; i < services_data.Count; i++) {
		services_status[services_data.Items[i].service.S] = [];
		for (var j = 0; j < REGION_NUMBER; j++) {
			region_key = "region"+String(j);
			status_key = "status"+String(j);
			services_status[services_data.Items[i].service.S][services_data.Items[i].regions_info.M[region_key].S] = services_data.Items[i].regions_info.M[status_key].N;
		}
	}
	
	console.log(services_status);
}

function store_regions_info(regions_data) {
	console.log("The following will be an array which store every regions information");

	for (var i = 0; i < regions_data.Count; i++)
		regions_info[regions_data.Items[i].region_id.S] = regions_data.Items[i].en_name.S;

	console.log(regions_info);
}

function load_current_status_time(unix_time) {
	var table_time = document.getElementById("table_time");

	var unixTimestamp = new Date(unix_time * 1000);
	table_time.innerHTML = " - "+unixTimestamp.toLocaleString();
}

function show_regions_checkbox() {
	var regions_checkbox = document.getElementById("regions_checkbox");
	var label_para = [];
	var input_para = [];
	var node = [];

	// Sort regions_info
	var regions_info_sort = [];
	for (var key in regions_info)
		regions_info_sort[regions_info_sort.length] = key;
	regions_info_sort.sort();


	for (var i = 0; i < regions_info_sort.length; i++) {
		var key = regions_info_sort[i];
		label_para[i] = document.createElement("label");
		input_para[i] = document.createElement("input");
		node[i] = document.createTextNode(regions_info[key]+" ("+key+")");
		
		label_para[i].className = "checkbox-inline";
		label_para[i].style.width = "240px";
		input_para[i].setAttribute("type", "checkbox");
		input_para[i].setAttribute("id", "region-"+key);
		input_para[i].setAttribute("name", "regions_checked");
		input_para[i].setAttribute("onchange", "change_region_selected()");
		for (var j = 0; j < DEFAULT_CHECKED_REGION.length; j++)
			if (DEFAULT_CHECKED_REGION[j] == key) {
				input_para[i].setAttribute("checked", "checked");
				break;
			}
		
		label_para[i].appendChild(input_para[i]);
		label_para[i].appendChild(node[i]);

		regions_checkbox.appendChild(label_para[i]);
	}
}

function reload_services_status() {
	var regions_checked = document.getElementsByName("regions_checked");
	var table_head = document.getElementById("services_status_table_head");
	var table_body = document.getElementById("services_status_table_body");
	var services_needed_show = [];


	// Get All Checked Regions
	for (var i = 0; i < regions_checked.length; i++)
		if (regions_checked[i].checked)
			services_needed_show[services_needed_show.length] = regions_checked[i].id.substr(7);


	// Remove All Regions In Table
	var table_head_th = table_head.childNodes;
	for (var i = table_head_th.length - 1; i > 0; i--)
		table_head.removeChild(table_head_th[i]);


	// Add Checked Regions In Table
	var regions_add_tag = [];
	var regions_add_text = [];
	for (var i = 0; i < services_needed_show.length; i++) {
		regions_add_tag[i] = document.createElement("th");
		regions_add_text[i] = document.createTextNode(regions_info[services_needed_show[i]]);

		regions_add_tag[i].style.textAlign = "center";

		regions_add_tag[i].appendChild(regions_add_text[i]);
		table_head.appendChild(regions_add_tag[i]);
	}


	// Remove All Services Status In Table
	var table_body_tr = table_body.childNodes;
	for (var i = table_body_tr.length - 1; i >= 0; i--)
		table_body.removeChild(table_body_tr[i]);
	

	// Add Services Status In Table
	var services_group_json = eval("("+SERVICES_GROUP_JSON+")");
	var services_status_tr;
	var services_status_td = [];
	var services_status_node = [];
	var services_status_span;
	var services_sum = 0;
	var service_name;
	var services_group_index = 1;
	console.log(services_group_json);

	for (var services_group in services_group_json) {
		// Add Services Group
		services_status_tr = document.createElement("tr");
		services_status_td[0] = document.createElement("td");
		services_status_node[0] = document.createTextNode(services_group);
		services_status_span = document.createElement("span");
		for (var i = 0; i < services_needed_show.length; i++)
			services_status_td[i+1] = document.createElement("td");

		services_status_tr.style.backgroundColor = "#337ab7";
		services_status_tr.style.color = "#fff";
		services_status_tr.style.fontWeight = "bold";
		services_status_span.className = "glyphicon glyphicon-plus";
		services_status_span.style.marginRight = "20px";
		services_status_span.style.marginLeft = "20px";
		services_status_span.style.cursor = "pointer";
		services_status_span.id = "services-group-"+services_group_index;
		services_status_span.setAttribute("onclick", "span_and_services_change(this)");

		services_status_td[0].appendChild(services_status_span);
		services_status_td[0].appendChild(services_status_node[0]);
		for (var i = 0; i <= services_needed_show.length; i++)
			services_status_tr.appendChild(services_status_td[i]);
		table_body.appendChild(services_status_tr);

		// Add Services
		services_sum += services_group_json[services_group].length;
		for (var i = 0; i < services_group_json[services_group].length; i++) {
			service_name = services_group_json[services_group][i];

			services_status_td[0] = document.createElement("td");
			services_status_node[0] = document.createTextNode(service_name);

			for (var j = 0; j < services_needed_show.length; j++) {
				services_status_td[j+1] = document.createElement("td");
				if (services_status[service_name][services_needed_show[j]] == 1) {
					services_status_node[j+1] = document.createElement("span");
					services_status_node[j+1].className = "glyphicon glyphicon-ok";
					services_status_td[j+1].style.color = "#00FF80";
				}
				else if (services_status[service_name][services_needed_show[j]] == 0) {
					services_status_node[j+1] = document.createElement("span");
					services_status_node[j+1].className = "glyphicon glyphicon-remove";
					services_status_td[j+1].style.color = "#FE4C40";
				}

				services_status_td[j+1].style.verticalAlign = "middle";
				services_status_td[j+1].style.textAlign = "center";
			}

			services_status_tr = document.createElement("tr");
			services_status_tr.setAttribute("name","services-group-"+services_group_index);

			for (var j = 0; j <= services_needed_show.length; j++) {
				services_status_td[j].appendChild(services_status_node[j]);
				services_status_tr.appendChild(services_status_td[j]);
			}
			table_body.appendChild(services_status_tr);
		}

		services_group_index++;
	}
}

function change_region_selected() {
	var regions_checked = document.getElementsByName("regions_checked");
	var region_selected = 0;

	for (var i = 0; i < regions_checked.length; i++)
		if (regions_checked[i].checked)
			region_selected++;

	if (region_selected > MAX_SELECTED_REGION)
		alert("您最多只能选择"+MAX_SELECTED_REGION+"个区域显示信息。");
	else
		reload_services_status();
}

function create_download_csv_file_button() {
	var form = document.getElementById("config_form");
	var download_form_group = document.createElement("div");
	var download_col_set = document.createElement("div");
	var download_tag = document.createElement("a");
	var download_node = document.createTextNode("下载csv文件");

	download_form_group.className = "form-group";
	download_col_set.className = "col-sm-offset-0 col-sm-12";
	download_tag.setAttribute("type", "button");
	download_tag.setAttribute("class", "btn btn-primary btn-lg");
	download_tag.setAttribute("onclick", "click_download_csv_file(this)");
	download_tag.id = "download_csv_file";
	download_tag.setAttribute("download", "services_status.csv");
	download_tag.setAttribute("href", "#");

	download_tag.appendChild(download_node);
	download_form_group.appendChild(download_tag);
	download_col_set.appendChild(download_form_group);
	form.appendChild(download_col_set);
}

function click_download_csv_file(aLink) {
	// Set .csv string
	var str = "服务,";
	var regions_checked = document.getElementsByName("regions_checked");
	var regions_in_csv = [];

	for (var i = 0; i < regions_checked.length; i++)
		if (regions_checked[i].checked) {
			regions_in_csv[regions_in_csv.length] = regions_checked[i].id.substr(7);
			str += regions_checked[i].id.substr(7)+",";
		}
	str += "\n";

	for (var service_name in services_status) {
		str += service_name+",";
		for (var i = 0; i < regions_in_csv.length; i++)
			if (services_status[service_name][regions_in_csv[i]] == 0)
				str += "×,";
			else if (services_status[service_name][regions_in_csv[i]] == 1)
				str += "√,";

		str += "\n";
	}
	// var str = "col1,col2,col3\nvalue1,value2,value3";
	str =  encodeURIComponent(str);


	// Let browser download file
	aLink.href = "data:text/csv;charset=utf-8,\ufeff"+str;
}

function span_and_services_change(span) {
	var services_in_group = document.getElementsByName(span.id);

	if (span.className == "glyphicon glyphicon-plus") {
		span.className = "glyphicon glyphicon-minus";
		for (var i = 0; i < services_in_group.length; i++)
			services_in_group[i].style.display = "none";
	}
	else if (span.className == "glyphicon glyphicon-minus") {
		span.className = "glyphicon glyphicon-plus";
		for (var i = 0; i < services_in_group.length; i++)
			services_in_group[i].removeAttribute("style");
	}
}

