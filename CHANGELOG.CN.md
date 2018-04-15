# CHANGELOG

---

`aws-services-list` 严格遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

不定

---

## 2.0.1
`2018-04-15`

- 🛠 项目由 `aws-status` 改名为 `aws-services-list` 。
- 🛠 重新定位本项目。从简单静态网页转变为网页应用。
- 🛠 重写前端架构及内容。新版本采用react、webpack、antd框架，使用yarn (npm)管理项目依赖和构建。
- 🐞 修复了不同设备的外观问题，现在能在不同宽高的设备上正常显示页面（除低版本IE）。
- 🌟 新增搜索功能，目前搜索支持如下：
  - 2 区域 && 0 服务。搜索结果返回两个区域间所有不同状态的服务（异或），并分别显示这些服务在这两个区域的状态。
  - 2/1 区域 && 1+ 服务。搜索结果返回在区域之中所选择服务的状态。
  - 1 区域 && 0 服务。搜索结果返回该区域中目前支持的所有服务。
  - 0 区域 && 1+ 服务。搜索结果返回所选择的服务全集在哪些 AWS 区域中全支持。
- 🌟 新增未完成页面（Unfinished Page），所有未完成的页面模块将导航至该页面。
- 🌟 新增错误页面（Error Page），所有非允许的请求将导航至该页面。
- 🌟 在原有的表格功能中增加了选择服务的功能。现在不仅可以选择区域，还可以选择服务。
- 🌟 表哥功能支持翻页功能，并固定了表头。
- 🌟 新增Feedback功能，位置在页面右下角，由Hotjar实现。
- 🌟 后端更新频率从6小时修改至12小时。

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
