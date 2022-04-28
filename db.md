# 数据库设计
## 字段设计
| 字段名      | 描述 |
|----------| --- |
| nickName | 用户名 |
| account  | 账户 |
| phone    | 手机号 |
| accountType | 账户类型 |
| departureCity | 出发城市 |
| targetCity | 目标城市 |
| internationality | 国际 |

## 用户 user
| 字段  | 类型  | 默认值 | 备注    |
|-----|-----|-----|-------|
| id  | |     |       |
| nickName | varchar | 用户  | 昵称 |
| account | varchar |     | 账号    |
| phone | varchar |     | 手机号,绑定后等同账号 |
| passwd | varchar |     | 密码    |
| accountType | char | 1用户,2管理员   | 账户类型1,2  |
| accountState | char | 1   | 账号状态,封禁 |
| createTime | date | now | 创建时间  |



## 地区表 area
| 字段        | 类型      | 默认值  | 可选值 | 备注  |
|-----------|---------|------|----|-----|
| id        | int(11) | pk   | number | id |
| cityname  | varchar | null |    | 城市名 |
| cityType  | char    | 1    | 1国内2国际 | 城市的名称 |
| cityState | int     | 1    | 1启用2封禁 | 封禁 |


## 飞机表 air
| 字段           | 类型      | 默认值 | 可选值                      | 备注     |
|--------------|---------|-----|--------------------------|--------|
| id | int | pk | n | id |
| airCode | varcahr | 255 | '' | 飞机名称 |
| row | int | 1 | 15 | 一共有多少排 |
| col | int | 1 | 5 | 一排几个座位 |
| state | char(2) | 1 | 1(启用) 2(暂停使用) | 飞机状态 |

## 航班表flight(管理员通过航线创建航班),需要输入价格和指定飞机和起飞时间
| 字段           | 类型      | 默认值 | 可选值                      | 备注     |
|--------------|---------|-----|--------------------------|--------|
| id           | int     | pk  | n                        | id     |
| airId  | varcahr | 755 | s                        | 飞机代号   |
| originalPrice | floor   | 1   | 0-99999                  | 原始机票价格 |
| currentPrice | floor   | 1   | 0-99999                  | 当前机票价格 |
| sailingTime  | varcahr    | 0 | 0                      | 起飞时间,unix时间戳   |
| langdinTime  | varcahr    | 0 | 0                     | 到站时间,unix时间戳   |
| flightState  | char    | 1   | 1(售票),2(值机),3(飞行中),4(结束) | 航班状态   |
| lateState    | cahr    | 1   | 1(正点),2(晚点)              | 航班晚点状态 |
| routeType    | char | 1 | 1(国内),2(国际) | 航线类型,是否为跨国航线,程序自动生成 | 
| departureCity | int  | null | n           | 出发城市          |
| targetCity   | int  | null | n           | 目标城市          |
| flightName   | varchar | '' | '' | 航班名称 |

## 乘机人 travel
| 字段  | 类型  | 默认值 | 可选值| 备注    |
|-----|-----|-----|---|-------|
| id | int | | | |
| userId | int | | | 用户id |
| name | varchar | '' | '' | 乘机人名字 |
| phone | varchar | '' |'' | 手机号 |
| card | varchar | '' |'' | 乘机人身份证 |
| default | char(2) | 1 | 1默认 2非默认 |是否为默认 |
| delete | char(1) | 2 | 1删除 2未删除 | 是否删除 |

## 订单表 orders (需要半小时支付)
| 字段       | 类型      | 默认值 | 可选值 | 备注                  |
|----------|---------|----|-----|---------------------|
| id       | int     | pk | n   | id |
| payState | char | 1 | 1(创建,待支付),2(已经支付),3(已经全部值机),4(订单结束,航班已经到站),5(订单取消),6(已经退款),7(部分退款),8(超时自动取消) | 订单状态 |
| userId | int | pk | n   | 用户id |
| flightId | int | pk | n | 航班id |
| ticketNum | int | 1 | 1-200 | 够票数量 |
| createTime | date | now | now | 创建时间 |
| payTime | date | null | null | 支付时间 |
| travelIds | varchar |  |  | 乘机人列表 |
| refundTick | varchar | | | 退款的机票id | 
| payPrice | floor | n | 0-9999 | 订单价格 |


## 机票表 airTicket (需要选坐,多机票订单不允许)
| 字段       | 类型      | 默认值 | 可选值 | 备注                  |
|----------|---------|----|-----|---------------------|
| id       | int     | pk | n   | id |
| orderId | int | pk | n   | 订单id |
| travel | int | pk | n | 乘机人id |
| ticketState | char(2) | 1 | 1(已经创建) 2(已经值机) 3(等待飞行) 4(退款) | 机票状态 |
| line | int | n | 1-24 | 座位排数 |
| row | int | n | 1-6 | 座位列数 |
| cussTime | int | n | n | 值机时间 |

## 购物车 car
| 字段       | 类型      | 默认值 | 可选值 | 备注                  |
|----------|---------|----|-----|---------------------|
| id       | int     | pk | n   | id |
| flightId | int | pk | n   | 航班id |
| userId | int | pk | n   | 用户id |

## 推荐活动集合表 recommendDir
| 字段            | 类型      | 默认值 | 可选值 | 备注              |
|---------------|---------|----|-----|-----------------|
| id            | int     | pk | n   | id              |
| recommendName | varcahr | '' | '' | 推荐名             |
| discript      | varcahr | '' | '' | 路线简介            |
| zindex        | int | 1 | n | 推荐等级,等级越高排名越前   |
| state | char | 1 | 1(启用),2(关闭) | 互动状态,是否启用活动     |
## 推荐机票活动相关的航班表 recommendFlight
| 字段       | 类型      | 默认值 | 可选值 | 备注   |
|----------|---------|----|-----|------|
| recommendId | int | pk | n | 推荐id | 
| flightId | int | pk | n | 航班id |
| recommendIndex | int | 1 | n | 推荐指数 |


