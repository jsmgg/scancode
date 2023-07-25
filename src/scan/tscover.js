const tsCoverage = require("type-coverage-core");
//ts覆盖率
function getTsCover(absoluteDir, ignore = []){
  console.log(`开始ts覆盖率统计...`);
  return tsCoverage.lint(absoluteDir,{
    ignoreFiles: ignore
  }).then(resAll => {
    const {
      correctCount = 0,
      totalCount = 0
    } = resAll||{};
    console.log('ts覆盖率统计完成!!!');
    if(totalCount && totalCount>0 && correctCount >= 0) {
      return {
        num:`${parseFloat(correctCount/totalCount*100).toFixed(2)}%`,
        correctCount,
        totalCount
      }
    }else{
      return '--'
    }
  })
  .catch(e => {
    console.log(`ts覆盖率统计失败:Error:${e.message}`);
    return ''
  });
}

module.exports = getTsCover;