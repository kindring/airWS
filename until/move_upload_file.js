// 移动上传文件
const fs = require('fs');
const path = require('path');
function move_upload_file(filePath){

}

// 上传文件
function uploadImage(){

}

/**
 * 上传文件
 * 1. 创建对应文件夹
 * 根据 /imei号/当天的unix时间戳
 * 2. 转移文件
 * 3. 判断是否为指定格式的文件
 * 4.1 ffmpeg转码
 * 5. 调用数据库存储过程存储数据
 */
function uploadFile(imei,file){
    // 创建文件夹路径
    let basePath = `/var/www/vt/directory/`
    let UnixTime = new Date().getDate();
    let dirPath = path.join(basePath,imei);

}
