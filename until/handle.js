/*
 * @Description: 
 * @Autor: kindring
 * @Date: 2021-12-14 15:19:56
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-14 17:17:09
 * @LastDescript: 
 */
function handle(promise) {
    return new Promise(resolve => {
        try{
            promise.then(val => {
                resolve([null, val])
            }).catch(err => {
                resolve([err])
            })
        }catch (e) {
            resolve([e]);
        }
    })
}

module.exports = handle;
