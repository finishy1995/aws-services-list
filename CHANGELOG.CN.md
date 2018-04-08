# CHANGELOG

---

`aws-services-list` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

不定

---

## 1.0.1

`2018-04-01`

- 🌟 新增更多的`region`和`service`支持
- 🌟 修改了项目的页面描述和网站地址

## 1.0.0

`2017-06-02`

- 🛠 重新构建后端架构，分离出`lambda-commander`、`lambda-detector`、`lambda-transmitter`。
- 🛠 修改项目名称从 AWS Service Status 到 AWS Services List
- 🌟 新增更多的`region`和`service`支持

## 0.9.2

`2017-04-10`

- 🐞 修复 DynamoDB Scan Bug （Scan 数据不全导致的数据缺省问题）
- 🌟 新增`exception-list`前端模块，用于错误数据的修正。
- 🌟 在将区域名称与区域ID同时显示在页面上。

## 0.9.1

`2017-03-15`

- 🌟 第一个预览版本，初步实现`regions-list`、`region-services-table`前端模块，以及`lambda-detector`后端模块。
- 🌟 实现测试工具爬取 AWS 官网上的 [区域表](https://aws.amazon.com/cn/about-aws/global-infrastructure/regional-product-services/) 对比数据的正确性。
