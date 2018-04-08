# AWS区域服务清单 [AWS Services List]


## 目录

- [简介](#简介)
- [成品展示](#成品展示)
- [特别感谢](#特别感谢)
- [版本历史](#版本历史)
- [更新计划](#更新计划)
- [项目部署](#项目部署)
	1. [Amazon DynamoDB](#amazon-dynamodb)
	2. [AWS Lambda](#aws-lambda)
	3. [Amazon CloudWatch Events](#amazon-cloudwatch-events)
	4. [Amazon S3](#amazon-s3)


## [简介](id:简介)

**特别提醒: 本项目不属于AWS官方项目。所有生成的信息不保证完全的正确性，请结合官方文档和官方信息。如果有任何疑问和建议，请联系邮箱：*[david.wang@finishy.cn](mailto:david.wang@finishy.cn)*。**

本项目采用Serverless架构（无服务器架构），使用Amazon CloudWatch Events、AWS Lambda、Amazon DynamoDB、Amazon S3、Amazon CloudFront等服务生成并展示数据。其中，Lambda函数由python 2.7编写，前端使用了Bootstrap 3.3.7版本。


## [成品展示](id:成品展示)

示例页面见下面的网址：

[http://aws-status-check-website.s3-website.ap-northeast-2.amazonaws.com/](http://aws-status-check-website.s3-website.ap-northeast-2.amazonaws.com/)


## [特别感谢](id:特别感谢)

- Leo Chen **@iceflow**
- David Wang **@finishy1995**


## [版本历史](id:版本历史)

- 2017-03-15
	1. 实现基础功能
- 2017-04-10
	1. 完善基础功能
	2. 更新近期服务列表
	3. 优化Lambda结构，DynamoDB更新前添加验证
- 2017-06-02
	1. 新增CodeStar、QuickSight、WorkDocs三项服务
	2. 修复所有已知Bug


## [更新计划](id:更新计划)

- 利用AWS CodeStar服务，完善项目部署和更新流程。
- 添加功能，显示近期区域服务更改情况。


## [项目部署](id:项目部署)

选择一个部署服务的AWS区域，确保该区域内至少包含有上述提到的所有服务。

### [Amazon DynamoDB](id:AmazonDynamoDB)

- 创建一张命名为aws-services-list表，主分区键为id（String）。其余按照实际情况进行配置，一般情况下默认即可。

### [AWS Lambda](id:AWSLambda)

- 创建三个Lambda函数，分别命名为aws-services-list-commander、aws-services-list-detector、aws-services-list-transmitter。模板选择空白模板，触发器暂时留空，运行语言Python 2.7，配置好IAM角色。其中，IAM角色至少需要Amazon DynamoDB的读写权限以及Amazon S3的写入权限。
- 将Lambda文件夹下的commander.py和data.json文件压缩为*.zip压缩包，并上传到任意S3存储桶中公开化。
- 修改aws-services-list-commander代码，选择刚上传到S3上的压缩包。
- 设置处理程序为commander.lambda_handler。
- 超时时间设置为5分钟。
- 将Lambda文件夹下的detector.py文件内容复制粘贴到aws-services-list-detector的代码栏。
- 超时时间设置为15秒。
- 将Lambda文件夹下的transmitter.py文件内容复制粘贴到aws-services-list-transmitter的代码栏。
- 超时时间设置为10秒。

### [Amazon CloudWatch Events](id:amazon-cloudwatch-events)

- 设置事件（Events）下的规则（Rules）共两条，分别为aws-services-list-commander和aws-services-list-transmitter。可以参考文档自定义触发的时间和周期，保证aws-services-list-transmitter和aws-services-list-commander触发周期相同且晚至少5分钟触发。
- 建立事件与Lambda同名函数的触发关系，其中aws-services-list-transmitter只需要设置一条无输入参数的触发，而aws-services-list-commander需要设置两条触发，输入常量分别为: {"min_services": 0, "max_services": 45}、{"min_services": 45, "max_services": 90}。（随着服务的增多，参数会进行相应的更改）

### [Amazon S3](id:AmazonS3)

- 创建S3储存桶，将./website文件夹下所有文件上传到储存桶中，并设置所有文件公开化
- 设置S3储存桶为静态网站，主页为index.html，错误页面为error.html
