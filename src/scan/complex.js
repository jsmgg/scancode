const {ESLint} = require('eslint');
const complexityThreshold = 20;//函数圈复杂度阈值
const MESSAGE_PREFIX = 'Maximum allowed is 0.';
const MESSAGE_SUFFIX = 'has a complexity of ';
function getMain(message) {
    return message.replace(MESSAGE_PREFIX, '').replace(MESSAGE_SUFFIX, '');
}
function getFunctionName(message) {
  const main = getMain(message);
  const test = main.match(/'([a-zA-Z0-9_$]+)'/g);
  return test ? test[0] : '匿名函数';
}
function getCyclomaticComplexity(message) {
  const matchComplexity = message.match(/a complexity of (\d+)\./);
  return matchComplexity ? Number(matchComplexity[1]) : 0;
}

function formatData(report, absoluteDir){
  return report.map(item=>{
    const {filePath, messages} = item;
    let cognitiveComplexity = 0;//文件认知复杂度
    let cyclomaticComplexity = 0;//文件总的圈复杂度
    let templateComplexity = 0;//模板复杂度
    let complexFunctions = [];// 复杂函数
    messages.forEach(message=>{
      if (message.ruleId === 'sonarjs/cognitive-complexity') {
        const _cognitiveComplexity = Number(message.message.match(/from (\d+) /)[1]);
        cognitiveComplexity += _cognitiveComplexity;
        return;
      }
      if (message.ruleId === '@nibfe/gc/vue-template-complex') {
        templateComplexity++;
        return;
      }
      if (message.ruleId === 'complexity') {
        const functionComplexity = getCyclomaticComplexity(message.message);
        if (functionComplexity > complexityThreshold) {
            complexFunctions.push({
                functionName: getFunctionName(message.message),
                line: message.line,
                cyclomaticComplexity: functionComplexity,
            });
        }
        cyclomaticComplexity += functionComplexity;
        return;
      }
    });
    return {
      filePath: filePath.replace(absoluteDir,''),
      cognitiveComplexity,
      cyclomaticComplexity,
      templateComplexity,
      complexFunctions
    }
  })
}

/**
 * 
 * @param {*} absoluteDir 
 * @param {*} ignore 
 * @returns {
      filePath,
      cognitiveComplexity,
      cyclomaticComplexity,
      templateComplexity,
      complexFunctions
    }[]
 */
async function getComplex(absoluteDir, ignore=[]){
  console.log('开始扫描代码复杂度...')
  try{
    const cli = new ESLint({
      overrideConfig:{
        env: ["browser","node","es6","amd","mocha","jest"].reduce((res, k)=>{
          res[k] = true;
          return res;
        },{}),
        ignorePatterns: ignore,
        parser: 'vue-eslint-parser',
        parserOptions:{
          parser:"@typescript-eslint/parser",
          ecmaVersion: 2020,
          extraFileExtensions: ['.vue'],
          tsconfigRootDir: `${absoluteDir}`,
          sourceType:"module",
          ecmaFeatures: {
            jsx: true
          }
        },
        plugins:[
          'sonarjs'
        ],
      },
      useEslintrc: false,
      extensions:[".vue",".js",".ts",".jsx","tsx"],
      baseConfig:{
        rules:{
          complexity: [2, { max: 0 }],
          'sonarjs/cognitive-complexity':[2, 0],
          'vue-template-complex':1
        }
      },
      fix: false,
      rulePaths:[`${process.cwd()}/src/rules`]
    });
    const report = await cli.lintFiles(absoluteDir);
    console.log(`代码复杂度扫描完成`)
    return formatData(report, absoluteDir);
  }catch(e){
    console.log(`代码复杂度扫描:Error:${e.message||'执行失败'}`)
    return [];
  }
}

module.exports = getComplex