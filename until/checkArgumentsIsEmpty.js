function checkArgumentsIsEmpty(array){
    return (-1 == array.findIndex((val,ind)=>{
        return val && ind !=0
    }))
}

module.exports = checkArgumentsIsEmpty;