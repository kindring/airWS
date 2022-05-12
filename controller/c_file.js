const fs = require('fs');
const path = require('path');
const handle = require('../until/handle')
const field = require('../maps/field')
const codeMap = require('../maps/rcodeMap')
const  enumMap = require('../maps/enum')
const configPath = require('../configs/path.json')

/**
 * 加载图片列表
 * @returns {Promise<*>}
 */
async function loadImgs(){
    let [err,files] = await  handle(fs.promises.readdir(configPath.upload))
    if(err){throw err}

    // 过滤非img内容
    return files.reduce(((a,c)=>{
        let ext = path.extname(c);
        if(enumMap.imageExt.includes(ext)){
            a.push({
                fileName:c,
                path: path.join(configPath.upload,c),
            })
        }else{

        }
        return a
    }),[])
}

async function toUpload (files){
    console.log(files)
    let file = files.file
    console.log(file)
    console.log(file.filepath)
    console.log(file.originalFilename)
    let targetPath = path.join(configPath.upload,file.originalFilename);
    let [err,res] = await handle(fs.promises.rename(file.filepath,targetPath))
    if(err){throw err}
    return true;
}

module.exports = {
    loadImgs,
    toUpload
}
