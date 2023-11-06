const getRepeatCode = require('./scan/repeat');
const getTsCover = require('./scan/tscover');
const getComplex = require('./scan/complex');

const DefaultIgnore = ['node_modules/**','build/**','dist/**']

async function main({
  root=__dirname,
  ignore = [],
  repeat = true,
  tscover = true,
  complex = true,
  absolutePath = false
} = {}){
  try{
    console.log(`${'**'.repeat(30)}开始扫描${'**'.repeat(30)}`);
    ignore = [...DefaultIgnore,...ignore].filter(item=>item.trim().length);
    const repeatData = repeat ? await getRepeatCode(root, ignore) : null;
    const tscoverData = tscover ? await getTsCover(root, ignore, absolutePath) : null;
    const complexData = complex ? await getComplex(root, ignore) : null;
    console.log(`${'**'.repeat(30)}扫描完成!!!${'**'.repeat(30)}`)
    return {
      repeat: repeatData,
      tscover: tscoverData,
      complex: complexData
    }
  }catch(err){
    console.log(`${'**'.repeat(30)}测试未通过:${err.message}${'**'.repeat(30)}`);
  }
}

// main().then(res=>{
//   console.log(JSON.stringify(res, null, ' '))
// });
module.exports = main;


