const glob = require("glob");


function getFileCount(root, ignore){
  ignore = ignore.map(item=>{
    let arr=item.split('/');
    if(arr[0] === '.' || arr[0] === '..' || arr[0] === ''){
      arr[0] = '**';
    }else{
      arr.unshift('**')
    }
    return arr.join('/')
  });
  let fileList = glob.sync(`**/*.{js,ts,tsx,jsx,vue,scss,css,less}`,{
    cwd:root,
    ignore
  });
  return fileList.length;
}

module.exports = getFileCount