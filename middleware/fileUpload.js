const path = require('path');
const fs = require('fs');
const formidable = require('formidable')
const code = require("../maps/rcodeMap");
const configPath = require('../configs/path.json')

function upload(req,res,next){
    let form = new formidable.IncomingForm();
    let allFile = [];
    form.uploadDir = configPath.tmp;
    form.type = true;
    form.on('progress', function(bytesReceived, bytesExpected) { //在控制台打印文件上传进度
        let progressInfo = {
            value: bytesReceived, //当前进度
            total: bytesExpected //总进度
        };
        let bar_progress = Math.floor((progressInfo.value / progressInfo.total) * 100);
        console.log(`当前进度: ${bar_progress}`);
    }).parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        if (err) {
            console.log(`文件接收失败${err}`);
            res.json({
                rcode: code.customError,
                msg: '文件上传失败'
            })
        }else{
            console.log('文件上传成功')
            console.log(fields)
            console.log('文件数量'+files.length)
            req.files = files;
            req.body = fields;
            next();
        }
    })
}

module.exports = upload;
