/**
 * Created by shenzuojun on 2017/8/1.
 * api设置
 */

// 开发环境
// export const MERCHANTINFO = 'http://192.168.2.167:8080/merchant/merchantRegister/getAllMerchantRegisterList'; // 商店的基本信息
// export const LOGIN = 'http://192.168.2.143:9082/jinghan-account/api/user/'; // account系统(登录/注册/找回密码)
// export const BOARD = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/board/'; // 今日看板
// export const BUSSINESS = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/bussiness/'; // 营业报表
// export const MERCHANT = 'http://192.168.2.132:8083/jinghan-platform/platform/v2/merchant/'; // 商户管理
// export const POSITION = 'http://192.168.2.6:9082/jinghan-account/api/user/position/'; // 职位
// export const DEPARTMENT = 'http://192.168.2.6:9082/jinghan-account/api/user/department/'; // 部门
// export const ROLES = 'http://192.168.2.6:9082/jinghan-account/api/user/role/'; // 角色
// export const EMPLOYEE = 'http://192.168.2.148:8888/platform/v2/employee/'; // 员工
// export const QUITEMPLOYEE = 'http://192.168.2.148:8888/platform/v2/quitEmployee/'; // 离职员工
// export const PRIVILEGE = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/privilege/'; // 权限配置
// export const MERCHANTIDQRCODE = 'http://192.168.2.11:9084/merchant/merchantBasicInfo/api/pc/getQrcodeInfo'; // 商户预点单二维码
// export const THIRD = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/third/'; // 第三方对账（团购外卖）
// export const PERIOD = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const MCT_PERIOD = 'http://192.168.2.88:8081/jinghan-merchant/merchantMealPeriod/api/pc/'; // merchant餐段（新增和修改）
// export const PACKAGE = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/setting/package/'; // 套餐
//
// export const REGISTER = 'http://192.168.2.167:8080/merchant/merchantRegister/api/pc/getMerchantRegisterContract'; // 商户注册协议
// export const PAYMENT_MERCHANT = 'http://192.168.2.203:7070/jinghan-merchant/api/'; // 快捷支付的merchant系统相关接口
//
// export const MEMBER = 'http://192.168.2.148:8888/platform/v2/member/'; // 会员中心
// export const FINANCE = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/finance/'; // 财务模块：财务规则
// export const EXTRA_CHARGE = 'http://192.168.2.148:8888/platform/v2/extraCharge'; // 财务模块：附加费设置
// export const MESSAGE_RECHARGE = 'http://192.168.2.167:8080/merchant/merchantMessageRecharge/'; // 个人中心：钱包充值、短信使用记录等
// export const UPDATE_PWD = 'http://192.168.2.148:8080/jinghan-account/api/user/updatePwdByOldPwd'; // 跟人中心：修改密码
// export const PAY_ROUTER = 'http://192.168.2.203:8078/jinghan-payment/api/pay/router'; // 个人中心：微信、支付宝支付
// export const ORDER = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/order/'; // 订单中心
// export const BRAND = 'http://192.168.2.132:8083/jinghan-platform/platform/v2/setting/brand'; // 菜品库
//
// export const MEAL_PERIOD = 'http://192.168.2.88:8080/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const COMMODITY = 'http://192.168.2.132:8083/jinghan-platform/platform/v2/setting/goods'; // 商品管理
// export const OPERATIONLOG = 'http://192.168.2.133:8080/jinghan-platform/platform/v2/operationLog/getOperationLog/'; // 操作日志
// export const DICTIONARYSETTINGS = 'http://192.168.2.132:8083/jinghan-platform/platform/v2/dictionary'; //    字典设置
// export const DICTIONARYSETTINGSFENLEI = 'http://192.168.2.6:9084/merchant/merchantDictSetting'; //  字典设置分类
// export const HANDLELOG = 'http://192.168.2.115:8080/merchant/logs/cloud/log/'; // 操作日志
//
// export const RESOURCE = 'http://192.168.2.9:9080/jinghan-fastdfs/fdfs/upload.shtml'; // 资源服务器
// export const TAKEOUT = 'http://192.168.2.203:7070/jinghan-merchant/api/merchant/'; // 外卖菜品关联获取菜品专用接口
// export const MEITUAN_URL = 'http://192.168.2.203:7070/jinghan-merchant/api/merchant/mapping'; // 获取团美url
// export const ELM_URL = 'http://192.168.2.203:7070/jinghan-merchant/api/eleme/'; // 获取饿了么url

  // 开发环境2
// export const MERCHANTINFO = 'http://192.168.2.143:9084/merchant/merchantRegister/getAllMerchantRegisterList'; // 商店的基本信息
// export const LOGIN = 'http://192.168.2.143:9081/jinghan-account/api/user/'; // 登录
// export const BOARD = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/board/'; // 今日看板
// export const BUSSINESS = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/bussiness/'; // 营业报表
// export const MERCHANT = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/merchant/'; // 商户管理
// export const POSITION = 'http://192.168.2.143:9081/jinghan-account/api/user/position/'; // 职位
// export const DEPARTMENT = 'http://192.168.2.143:9081/jinghan-account/api/user/department/'; // 部门
// export const ROLES = 'http://192.168.2.143:9081/jinghan-account/api/user/role/'; // 角色
// export const EMPLOYEE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/employee/'; // 员工
// export const QUITEMPLOYEE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/quitEmployee/'; // 离职员工
// export const PRIVILEGE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/privilege/'; // 权限配置
// export const MERCHANTIDQRCODE = 'http://192.168.2.143:9084/merchant/merchantBasicInfo/api/pc/getQrcodeInfo'; // 商户预点单二维码
// export const THIRD = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/third/'; // 第三方对账（团购外卖）
// export const PERIOD = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const MCT_PERIOD = 'http://192.168.2.143:9084/merchant/merchantMealPeriod/api/pc/'; // merchant餐段（新增和修改）
// export const PACKAGE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/setting/package/'; // 套餐
//
// export const REGISTER = 'http://192.168.2.143:9084/merchant/merchantRegister/api/pc/getMerchantRegisterContract'; // 商户注册协议
// export const PAYMENT_MERCHANT = 'http://192.168.2.143:9084/merchant/api/'; // 快捷支付的merchant系统相关接口
//
// export const MEMBER = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/member/'; // 会员中心
// export const FINANCE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/finance/'; // 财务模块：财务规则
// export const EXTRA_CHARGE = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/extraCharge/'; // 财务模块：附加费设置
// export const MESSAGE_RECHARGE = 'http://192.168.2.143:9084/merchant/merchantMessageRecharge/'; // 个人中心：钱包充值、短信使用记录等
// export const UPDATE_PWD = 'http://192.168.2.143:9081/jinghan-account/api/user/updatePwdByOldPwd'; // 跟人中心：修改密码
// export const PAY_ROUTER = 'http://192.168.2.143:9089/jinghan-payment/api/pay/router'; // 个人中心：微信、支付宝支付
// export const ORDER = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/order/'; // 订单中心
// export const BRAND = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/setting/brand'; // 菜品库
//
// export const MEAL_PERIOD = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const COMMODITY = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/setting/goods'; // 商品管理
// export const OPERATIONLOG = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/operationLog/getOperationLog/'; // 操作日志
// export const DICTIONARYSETTINGS = 'http://192.168.2.143:9095/jinghan-platform/platform/v2/dictionary'; //    字典设置
// export const DICTIONARYSETTINGSFENLEI = 'http://192.168.2.143:9084/merchant/merchantDictSetting'; //  字典设置分类
// export const HANDLELOG = 'http://192.168.2.143:9084/merchant/logs/cloud/log/'; // 操作日志
//
// export const RESOURCE = 'http://192.168.2.9:9080/jinghan-fastdfs/fdfs/upload.shtml'; // 资源服务器
// export const TAKEOUT = 'http://192.168.2.143:9084/merchant/api/merchant/'; // 外卖菜品关联获取菜品专用接口
// export const MEITUAN_URL = 'http://192.168.2.143:9084/merchant/api/merchant/mapping'; // 获取团美url
// export const ELM_URL = 'http://192.168.2.143:9084/merchant/api/eleme/'; // 获取饿了么url
//
// export const PROVINCE = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllProvinceList'; // 初始化省
// export const CITY = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllCityListByProviceId'; // 初始化市
// export const AREA = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllAreaListByCityId'; // 初始化区/县

// 测试环境
// export const MERCHANTINFO = 'http://192.168.2.11:9084/merchant/merchantRegister/getAllMerchantRegisterList'; // 商店的基本信息
// export const LOGIN = 'http://192.168.2.11:9081/jinghan-account/api/user/'; // 登录
// export const BOARD = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/board/'; // 今日看板
// export const BUSSINESS = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/bussiness/'; // 营业报表
// export const MERCHANT = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/merchant/'; // 商户管理
// export const POSITION = 'http://192.168.2.11:9081/jinghan-account/api/user/position/'; // 职位
// export const DEPARTMENT = 'http://192.168.2.11:9081/jinghan-account/api/user/department/'; // 部门
// export const ROLES = 'http://192.168.2.11:9081/jinghan-account/api/user/role/'; // 角色
// export const EMPLOYEE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/employee/'; // 员工
// export const QUITEMPLOYEE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/quitEmployee/'; // 离职员工
// export const PRIVILEGE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/privilege/'; // 权限配置
// export const MERCHANTIDQRCODE = 'http://192.168.2.11:9084/merchant/merchantBasicInfo/api/pc/getQrcodeInfo'; // 商户预点单二维码
// export const THIRD = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/third/'; // 第三方对账（团购外卖）
// export const PERIOD = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const MCT_PERIOD = 'http://192.168.2.11:9084/merchant/merchantMealPeriod/api/pc/'; // merchant餐段（新增和修改）
// export const PACKAGE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/setting/package/'; // 套餐
//
// export const REGISTER = 'http://192.168.2.11:9084/merchant/merchantRegister/api/pc/getMerchantRegisterContract'; // 商户注册协议
// export const PAYMENT_MERCHANT = 'http://192.168.2.11:9084/merchant/api/'; // 快捷支付的merchant系统相关接口
//
// export const MEMBER = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/member/'; // 会员中心
// export const FINANCE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/finance/'; // 财务模块：财务规则
// export const EXTRA_CHARGE = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/extraCharge/'; // 财务模块：附加费设置
// export const MESSAGE_RECHARGE = 'http://192.168.2.11:9084/merchant/merchantMessageRecharge/'; // 个人中心：钱包充值、短信使用记录等
// export const UPDATE_PWD = 'http://192.168.2.11:9081/jinghan-account/api/user/updatePwdByOldPwd'; // 跟人中心：修改密码
// export const PAY_ROUTER = 'http://192.168.2.11:9089/jinghan-payment/api/pay/router'; // 个人中心：微信、支付宝支付
// export const ORDER = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/order/'; // 订单中心
// export const BRAND = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/setting/brand'; // 菜品库
//
// export const MEAL_PERIOD = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const COMMODITY = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/setting/goods'; // 商品管理
// export const OPERATIONLOG = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/operationLog/getOperationLog/'; // 操作日志
// export const DICTIONARYSETTINGS = 'http://192.168.2.11:9095/jinghan-platform/platform/v2/dictionary'; //    字典设置
// export const DICTIONARYSETTINGSFENLEI = 'http://192.168.2.11:9084/merchant/merchantDictSetting'; //  字典设置分类
// export const HANDLELOG = 'http://192.168.2.11:9084/merchant/logs/cloud/log/'; // 操作日志
//
// export const RESOURCE = 'http://192.168.2.9:9080/jinghan-fastdfs/fdfs/upload.shtml'; // 资源服务器
// export const TAKEOUT = 'http://192.168.2.11:9084/merchant/api/merchant/'; // 外卖菜品关联获取菜品专用接口
// export const MEITUAN_URL = 'http://192.168.2.11:9084/merchant/api/merchant/mapping'; // 获取团美url
// export const ELM_URL = 'http://192.168.2.11:9084/merchant/api/eleme/'; // 获取饿了么url
//
// export const PROVINCE = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllProvinceList'; // 初始化省
// export const CITY = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllCityListByProviceId'; // 初始化市
// export const AREA = 'http://192.168.2.11:9084/merchant/district/api/pc/getAllAreaListByCityId'; // 初始化区/县

// 灰度环境
// export const MERCHANTINFO = 'http://192.168.2.9:9084/merchant/merchantRegister/getAllMerchantRegisterList'; // 商店的基本信息
// export const LOGIN = 'http://192.168.2.9:9081/jinghan-account/api/user/'; // 登录
// export const BOARD = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/board/'; // 今日看板
// export const BUSSINESS = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/bussiness/'; // 营业报表
// export const MERCHANT = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/merchant/'; // 商户管理
// export const POSITION = 'http://192.168.2.9:9081/jinghan-account/api/user/position/'; // 职位
// export const DEPARTMENT = 'http://192.168.2.9:9081/jinghan-account/api/user/department/'; // 部门
// export const ROLES = 'http://192.168.2.9:9081/jinghan-account/api/user/role/'; // 角色
// export const EMPLOYEE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/employee/'; // 员工
// export const QUITEMPLOYEE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/quitEmployee/'; // 离职员工
// export const PRIVILEGE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/privilege/'; // 权限配置
// export const MERCHANTIDQRCODE = 'http://192.168.2.9:9084/merchant/merchantBasicInfo/api/pc/getQrcodeInfo'; // 商户预点单二维码
// export const THIRD = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/third/'; // 第三方对账（团购外卖）
// export const PERIOD = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const MCT_PERIOD = 'http://192.168.2.9:9084/merchant/merchantMealPeriod/api/pc/'; // merchant餐段（新增和修改）
// export const PACKAGE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/setting/package/'; // 套餐
//
// export const REGISTER = 'http://192.168.2.9:9084/merchant/merchantRegister/api/pc/getMerchantRegisterContract'; // 商户注册协议
// export const PAYMENT_MERCHANT = 'http://192.168.2.9:9084/merchant/api/'; // 快捷支付的merchant系统相关接口
//
// export const MEMBER = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/member/'; // 会员中心
// export const FINANCE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/finance/'; // 财务模块：财务规则
// export const EXTRA_CHARGE = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/extraCharge/'; // 财务模块：附加费设置
// export const MESSAGE_RECHARGE = 'http://192.168.2.9:9084/merchant/merchantMessageRecharge/'; // 个人中心：钱包充值、短信使用记录等
// export const UPDATE_PWD = 'http://192.168.2.9:9081/jinghan-account/api/user/updatePwdByOldPwd'; // 跟人中心：修改密码
// export const PAY_ROUTER = 'http://192.168.2.9:9089/jinghan-payment/api/pay/router'; // 个人中心：微信、支付宝支付
// export const ORDER = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/order/'; // 订单中心
// export const BRAND = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/setting/brand'; // 菜品库
//
// export const MEAL_PERIOD = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/meal/period'; // 餐段
// export const COMMODITY = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/setting/goods'; // 商品管理
// export const OPERATIONLOG = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/operationLog/getOperationLog/'; // 操作日志
// export const DICTIONARYSETTINGS = 'http://192.168.2.9:9095/jinghan-platform/platform/v2/dictionary'; //    字典设置
// export const DICTIONARYSETTINGSFENLEI = 'http://192.168.2.9:9084/merchant/merchantDictSetting'; //  字典设置分类
// export const HANDLELOG = 'http://192.168.2.9:9084/merchant/logs/cloud/log/'; // 操作日志
//
// export const RESOURCE = 'http://192.168.2.9:9080/jinghan-fastdfs/fdfs/upload.shtml'; // 资源服务器
// export const TAKEOUT = 'http://192.168.2.9:9084/merchant/api/merchant/'; // 外卖菜品关联获取菜品专用接口
// export const MEITUAN_URL = 'http://192.168.2.9:9084/merchant/api/merchant/mapping'; // 获取团美url
// export const ELM_URL = 'http://192.168.2.9:9084/merchant/api/eleme/'; // 获取饿了么url
//
// export const PROVINCE = 'http://192.168.2.9:9084/merchant/district/api/pc/getAllProvinceList'; // 初始化省
// export const CITY = 'http://192.168.2.9:9084/merchant/district/api/pc/getAllCityListByProviceId'; // 初始化市
// export const AREA = 'http://192.168.2.9:9084/merchant/district/api/pc/getAllAreaListByCityId'; // 初始化区/县

// 线上环境
export const MERCHANTINFO = 'https://merchant.jinghanit.com/merchant/merchantRegister/getAllMerchantRegisterList'; // 商店的基本信息
export const LOGIN = 'https://account.jinghanit.com/jinghan-account/api/user/'; // 登录
export const BOARD = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/board/'; // 今日看板
export const BUSSINESS = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/bussiness/'; // 营业报表
export const MERCHANT = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/merchant/'; // 商户管理
export const POSITION = 'https://account.jinghanit.com/jinghan-account/api/user/position/'; // 职位
export const DEPARTMENT = 'https://account.jinghanit.com/jinghan-account/api/user/department/'; // 部门
export const ROLES = 'https://account.jinghanit.com/jinghan-account/api/user/role/'; // 角色
export const EMPLOYEE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/employee/'; // 员工
export const QUITEMPLOYEE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/quitEmployee/'; // 离职员工
export const PRIVILEGE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/privilege/'; // 权限配置
export const MERCHANTIDQRCODE = 'https://merchant.jinghanit.com/merchant/merchantBasicInfo/api/pc/getQrcodeInfo'; // 商户预点单二维码
export const THIRD = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/third/'; // 第三方对账（团购外卖）
export const PERIOD = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/meal/period'; // 餐段
export const MCT_PERIOD = 'https://merchant.jinghanit.com/merchant/merchantMealPeriod/api/pc/'; // merchant餐段（新增和修改）
export const PACKAGE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/setting/package/'; // 套餐

export const REGISTER = 'https://merchant.jinghanit.com/merchant/merchantRegister/api/pc/getMerchantRegisterContract'; // 商户注册协议
export const PAYMENT_MERCHANT = 'https://merchant.jinghanit.com/merchant/api/'; // 快捷支付的merchant系统相关接口

export const MEMBER = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/member/'; // 会员中心
export const FINANCE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/finance/'; // 财务模块：财务规则
export const EXTRA_CHARGE = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/extraCharge/'; // 财务模块：附加费设置
export const MESSAGE_RECHARGE = 'https://merchant.jinghanit.com/merchant/merchantMessageRecharge/'; // 个人中心：钱包充值、短信使用记录等
export const UPDATE_PWD = 'https://account.jinghanit.com/jinghan-account/api/user/updatePwdByOldPwd'; // 跟人中心：修改密码
export const PAY_ROUTER = 'https://pay.jinghanit.com/jinghan-payment/api/pay/router'; // 个人中心：微信、支付宝支付
export const ORDER = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/order/'; // 订单中心
export const BRAND = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/setting/brand'; // 菜品库

export const MEAL_PERIOD = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/meal/period'; // 餐段
export const COMMODITY = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/setting/goods'; // 商品管理
export const OPERATIONLOG = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/operationLog/getOperationLog/'; // 操作日志
export const DICTIONARYSETTINGS = 'https://platform.jinghanit.com/jinghan-platform/platform/v2/dictionary'; //    字典设置
export const DICTIONARYSETTINGSFENLEI = 'https://merchant.jinghanit.com/merchant/merchantDictSetting'; //  字典设置分类
export const HANDLELOG = 'https://merchant.jinghanit.com/merchant/logs/cloud/log/'; // 操作日志

export const RESOURCE = 'https://file.jinghanit.com/jinghan-fastdfs/fdfs/upload.shtml'; // 资源服务器
export const TAKEOUT = 'https://merchant.jinghanit.com/merchant/api/merchant/'; // 外卖菜品关联获取菜品专用接口
export const MEITUAN_URL = 'https://merchant.jinghanit.com/merchant/api/merchant/mapping'; // 获取团美url
export const ELM_URL = 'https://merchant.jinghanit.com/merchant/api/eleme/'; // 获取饿了么url

export const PROVINCE = 'https://merchant.jinghanit.com/merchant/district/api/pc/getAllProvinceList'; // 初始化省
export const CITY = 'https://merchant.jinghanit.com/merchant/district/api/pc/getAllCityListByProviceId'; // 初始化市
export const AREA = 'https://merchant.jinghanit.com/merchant/district/api/pc/getAllAreaListByCityId'; // 初始化区/县
