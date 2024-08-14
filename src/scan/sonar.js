const {ESLint} = require('eslint');

function formatData(report, absoluteDir){
  return report.map(item=>{
    const {filePath, messages} = item;
    const result = [];
    messages.forEach(message=>{
      result.push({
        ...message
      })
    });
    return {
      filePath: filePath.replace(`${absoluteDir}/`,''),
      messages:result
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
async function getSonarMsg(absoluteDir, ignore=[]){
  console.log('sonar规则扫描开始...')
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
        extends: ["plugin:sonarjs/recommended"]
      },
      useEslintrc: false,
      extensions:[".vue",".js",".ts",".jsx","tsx"],
      baseConfig:{
        // rules:{
        //   complexity: [2, { max: 0 }],
        //   'sonarjs/cognitive-complexity':[2, 0],
        //   'vue-template-complex':1
        // }
      },
      fix: false
    });
    const report = await cli.lintFiles(absoluteDir);
    console.log(`sonar规则扫描完成`)
    return formatData(report, absoluteDir);
  }catch(e){
    console.log(`****sonar规则扫描:Error:${e.message||'执行失败'}`)
    return [];
  }
}

module.exports = getSonarMsg