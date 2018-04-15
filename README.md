# AWS Services List


## 简介

**特别提醒: 本项目不属于AWS官方项目。所有生成的信息不保证完全的正确性，请结合官方文档和官方信息。如果有任何疑问和建议，请联系邮箱：*[david.wang@finishy.cn](mailto:david.wang@finishy.cn)*。**

一套网站应用展示 AWS 区域对应的服务信息，并提供搜索功能以支持区域选型和区域对比。由Serverless架构实现，使用Amazon CloudWatch Events、AWS Lambda、Amazon DynamoDB、Amazon S3、Amazon CloudFront等服务生成并展示数据，前端使用了React、Webpack以及Antd。


## 功能

- 数据每12小时自动更新。
- 可选择显示指定区域和指定服务的 AWS 区域表。
- 下载 AWS 区域表 csv 文件。
- 特定区域和特定服务的搜索。
- 需求的服务集合在哪些区域全部能满足的搜索。
- 区域间服务不同的对比。


## 支持环境

- 现代浏览器和 IE9 及以上。
- 手机、平板及电脑端。


## 示例

示例页面见下面的网址：

[http://aws-status-check-website.s3-website.ap-northeast-2.amazonaws.com/](http://aws-status-check-website.s3-website.ap-northeast-2.amazonaws.com/)


## 安装

### 代码构建

```bash
$ git clone https://github.com/finishy1995/aws-services-list.git
$ cd aws-services-list
$ yarn install
$ yarn build
```

### 服务端配置

选择一个部署所有服务的AWS区域，确保该区域内至少包含有上述提到的所有服务。

#### Amazon DynamoDB

- 创建一张命名为aws-services-list表，主分区键为id（String）。其余按照实际情况进行配置，一般情况下默认即可。

#### AWS Lambda

- 创建三个Lambda函数，分别命名为aws-services-list-commander、aws-services-list-detector、aws-services-list-transmitter。模板选择空白模板，触发器暂时留空，运行语言Python 2.7，配置好IAM角色。其中，IAM角色至少需要Amazon DynamoDB的读写权限以及Amazon S3的写入权限。
- 将Lambda文件夹下的commander.py和data.json文件压缩为*.zip压缩包，并上传到任意S3存储桶中公开化。
- 修改aws-services-list-commander代码，选择刚上传到S3上的压缩包。
- 设置处理程序为commander.lambda_handler。
- 超时时间设置为5分钟。
- 将Lambda文件夹下的detector.py文件内容复制粘贴到aws-services-list-detector的代码栏。
- 超时时间设置为15秒。
- 将Lambda文件夹下的transmitter.py文件内容复制粘贴到aws-services-list-transmitter的代码栏。
- 超时时间设置为10秒。

#### Amazon CloudWatch Events

- 设置事件（Events）下的规则（Rules）共两条，分别为aws-services-list-commander和aws-services-list-transmitter。可以参考文档自定义触发的时间和周期，保证aws-services-list-transmitter和aws-services-list-commander触发周期相同且晚至少5分钟触发。
- 建立事件与Lambda同名函数的触发关系，其中aws-services-list-transmitter只需要设置一条无输入参数的触发，而aws-services-list-commander需要设置四条触发，输入常量分别为: {"min_services": 0, "max_services": 30}、{"min_services": 30, "max_services": 60}、{"min_services": 60, "max_services": 90}、{"min_services": 90, "max_services": 120}。（随着服务的增多，参数会进行相应的更改）

#### Amazon S3

- 创建S3储存桶，将 `build` 文件夹下所有文件上传到储存桶中，并设置所有文件公开化
- 设置S3储存桶为静态网站，主页为index.html


## 本地开发

```bash
$ git clone https://github.com/finishy1995/aws-services-list.git
$ cd aws-services-list
$ yarn install
$ yarn start
```

打开浏览器访问 http://127.0.0.1:8080 


## 特别感谢

- Leo Chen [@iceflow](https://github.com/iceflow)
- David Wang [@finishy1995](https://github.com/finishy1995)


## 链接

- [首页](http://aws-status-check-website.s3-website.ap-northeast-2.amazonaws.com/)
- [项目地址](https://github.com/finishy1995/aws-services-list)
- [更新日志](CHANGELOG.CN.md)
- [代码规范](.editorconfig)
- [开源协议](LICENSE)
- [反馈查询](https://www.hotjar.com/)
- [React 底层基础组件](http://react-component.github.io/)
- [Antd 底层组件](https://github.com/ant-design/ant-design/)
