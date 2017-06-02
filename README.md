# AWS服务状态面板 [AWS Service Status Dashboard]


## 目录

- [简介](#overview)
- [成品展示](#product)
- [特别感谢](#thanks)
- [项目部署](#setup)
	- [Amazon CloudWatch Events](#CloudWatchEvents)
	- [AWS Lambda](#AWSLambda)
	- [Amazon DynamoDB](id:AmazonDynamoDB)
	- [Amazon S3](id:AmazonS3)


## [简介](id:overview)

**特别提醒: 本项目不属于AWS官方项目。所有生成的信息不保证完全的正确性，请结合官方文档和官方信息。如果有任何疑问和建议，请联系邮箱：*[david.wang@finishy.cn](mailto:david.wang@finishy.cn)*。**

本项目采用Serverless架构（无服务器架构），使用Amazon CloudWatch Events、AWS Lambda、Amazon DynamoDB、Amazon S3、Amazon CloudFront等服务生成并展示数据。其中，Lambda函数由python 2.7编写，前端使用了Bootstrap 3.3.7版本。


## [成品展示](id:product)

实例页面见下面的网址：

[http://aws-status-check-website.s3-website-ap-northeast-1.amazonaws.com](http://aws-status-check-website.s3-website-ap-northeast-1.amazonaws.com)


## [特别感谢](id:thanks)

- Leo Chen **@iceflow**
- David Wang **@finishy1995**


## [版本历史](id:versions)

- 2017-04-13
- 2017-06-02 新增CodeStar、QuickSight、WorkDocs三项服务的检测；修复所有已知Bug。

## [项目部署](id:deploy)

### [Amazon CloudWatch Events](id:CloudWatchEvents)

- 设置规则（Rules），每隔固定时间触发一次。（由于每条规则最多只能支持五个触发事件，可能需要设置多条规则。）

### [AWS Lambda](id:AWSLambda)

- 选择空白函数（Blank Function）
- 设置触发器为Amazon CloudWatch Events中已设置好的规则
- 设置运行环境为python 2.7，将./lambda文件夹下所有文件压缩为*.zip文件，上传至S3并公开化，将文件加载进Lambda
- 设置环境变量START_RANGE和END_RANGE，分别为状态检测起始位置和终止位置（由于Lambda最长运行事件为5分钟，所以需要多项Lambda“并行”运算得出状态结果。）。建议每隔15个服务设置一个Lambda函数，目前记录了近80条服务，至少需要6条Lambda函数。
- 设置Lambda处理程序为main.lambda_handler
- 设置Lambda的IAM Role，至少需要Amazon DynamoDB的读写权限

### [Amazon DynamoDB](id:AmazonDynamoDB)

- 设置aws-services-status表，主键为id（Number），主排序键为service（String），并插入第一条数据："id：0; service: Latest Update; latest: 32"
- 设置aws-regions表，主键为region_id（String，例：us-east-1），主排序键为en_name（String，例：Northern Virginia），表中数据请参考当前AWS官方区域信息填充

### [Amazon S3](id:AmazonS3)

- 创建S3储存桶，将./website文件夹下所有文件上传到储存桶中，并设置所有文件公开化
- 设置S3储存桶为静态网站，主页为index.html，错误页面为error.html
