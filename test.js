const path = require("path");
const getRepeatCode = require('./src/scan/repeat');
const getTsCover = require('./src/scan/tscover');
const getComplex = require('./src/scan/complex');


async function main(){
  try{
    console.log(`${'**'.repeat(30)}开始测试${'**'.repeat(30)}`)
    const ignore = ['ignore.js','node_modules/**'];
    const repeatData = await getRepeatCode(`./test`, ignore);
    console.log(`重复代码`,JSON.stringify(repeatData, null, '  '))
    const tsCoverData = await getTsCover(`./test`, ignore);
    //console.log(`ts覆盖率`,tsCoverData)
    const complex = await getComplex(`./test`, ignore);
    //console.log('complex',JSON.stringify(complex,null,'  '))

    
    console.log(`${'**'.repeat(30)}测试通过!!!${'**'.repeat(30)}`)
  }catch(err){
    console.log(`${'**'.repeat(30)}测试未通过:${err.message}${'**'.repeat(30)}`);
  }
}

main();


