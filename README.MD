## scancode
一款前端代码扫描工具，通过代码圈复杂度、认知复杂度、复杂函数和复杂文件数、ts覆盖率、代码重复率等维度度量代码质量。
目前只支持vue开发的前端项目


### 使用方法
1. 安装依赖

```
npm install scancode -D
```
2. 运行扫描任务

```javascript
const scanCode = require('scancode');
scanCode({
	root:`${__dirname}/src`,
	ignore: ['build/**'],
	repeat: true,
	tscover: true,
	complex: true
}).then(res=>{
	console.log(res);//代码扫描结果
})

```
### 入参说明
1. root  
扫描目录，目前一次只支持扫描一个目录，默认值:__dirname  
2. ignore  
忽略文件或者文件目录，按照数组形式传递，支持多个，默认值: ['node_modules/**','build/**','dist/**']  
3. repeat  
是否扫描代码重复率，默认：true 开启状态  
4. tscover  
是否扫描ts覆盖率，默认为：true 开启状态
5. complex  
是否开启代码复杂度扫描，默认为：true 开启状态
### 扫描结果说明
结果示例

```
{
	"repeat":{
		"repeatScanLines":2939,//扫描代码总行数,去除了文件收尾的注释行数,其他地方的注释和空行全部包含，一般以该字段为代码总行数
		"duplicatedLines":199,//重复代码行数
		"percentage":"10%", //重复百分比【重复率】
		"data":[//重复代码块明细
			{
				"lines": 12,//重复行数
				"firstFile":{
					"path":"src/test.js",//重复文件地址
					"start":12,  //重复代码块开始行位置
					"end":24  //重复代码块结束行位置
				},
				"firstFile":{
					"path":"src/index.js",//重复文件地址
					"start":24,  //重复代码块开始行位置
					"end":36  //重复代码块结束行位置
				}
			}
		]
	},
	"tscover":{//ts覆盖数据
		"num": "87%",//ts覆盖率,
		"correctCount": 233, //ts声明的变量数据
		"totalCount": 250 //总变量数
	},
	"complex": [//代码复杂度数据
		{
			"filePath":"src/test.js",//文件路径
			"cognitiveComplexity":20,//当前文件总认知复杂度
			"cyclomaticComplexity":30,//当前文件总圈复杂度
			"templateComplexity": 12,//当前文件总模板复杂度
			"complexFunctions":[//当前文件复杂函数列表
				{
					"functionName":"onChange",//函数名称，匿名函数返回:匿名函数
					"line": 24,//函数所在行
					"cyclomaticComplexity": 23//函数圈复杂度，过滤掉了圈复杂度小于20的函数
				}
			]
		}
	]
}
```

### 名词解释
圈复杂度、认知复杂度、重复代码不做解释，自己百度就行。  
ts覆盖率：有ts定义的变量个数除以总的变量个数，ts定义为any的变量不算在ts定义变量里面。  
模板复杂度：对应vue模板中if、for、template 出现的次数  

