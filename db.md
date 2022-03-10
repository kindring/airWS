# 数据库设计
## 用户
| 字段  | 类型  | 默认值 | 备注    |
|-----|-----|--|-------|
| id  | |  |       |
| nickName | varchar | 用户 | 昵称 |
| account | varchar |  | 账号    |
| phone | varchar |  | 手机号,绑定后等同账号 |
| passwd | varchar |  | 密码    |
| type | char | 2 | 账户类型  |
| state | char | 1 | 账号状态,封禁 |
| createTime | date | now | 创建时间  |