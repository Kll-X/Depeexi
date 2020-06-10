// 中文匹配
export const chinesePattern = /^[\u4e00-\u9fa5]+.*$/

// 非中文匹配
export const noneChinesePattern = /^[^\u4e00-\u9fa5]+$/

// 数字校验
export const numberPattern = /^[0-9]+$/

// 应用英文名正则, 数据库名字正则, 用户账号 允许英文,数字,中划线,下划线
export const letterNumberDashUnderlinePattern = /^[a-zA-Z0-9-_]+$/;

// 编码匹配
export const codePattern = /^[^\u4e00-\u9fa5]+$/;

// 中文名称匹配
export const chineseNamePattern = /^[\u4e00-\u9fa5]+.*$/;

// 英文名称匹配
export const englishNamePattern = /^[^\u4e00-\u9fa5]+$/;

// 价格校验
export const pricePattern = /^[0-9]+$/
