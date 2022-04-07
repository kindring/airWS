/*
 * @Description: 日志工具函数
 * @Autor: kindring
 * @Date: 2021-12-14 14:07:17
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-14 14:46:16
 * @LastDescript: 
 */
const Path = require('path');

const log4js = require('log4js');

levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL,
}

const logFileName = 'info.log';

const _path = Path.resolve(__dirname, `log/${logFileName}`)
console.log(_path);
log4js.configure({
    // 输出到控制台的内容，同时也输出到日志文件中
    replaceConsole: true,
    appenders: {
        cheese: {
            // 设置类型为 dateFile
            type: 'dateFile',
            // 配置文件名
            filename: _path,
            // 指定编码格式为 utf-8
            encoding: 'utf-8',
            // 配置 layout，此处使用自定义模式 pattern
            // layout: 'basic',
            // 日志文件按日期（天）切割
            pattern: "yyyy-MM-dd",
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true,
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        // 设置默认的 categories
        default: { appenders: ['cheese', 'console'], level: 'debug' },
    }
})

exports.logger = (name, level) => {
    const logger = log4js.getLogger(name)
        // 默认为debug权限及以上
    logger.level = levels[level] || levels['debug']
    return logger
}