const child_process = require('child_process');

function formatTime(date, format = 'yyyy-MM-dd', invalidText = '--') {
  if (+date <= 0) {
    return invalidText
  }
  const dt = new Date(+date)
  const WeekTextMap = ['天', '一', '二', '三', '四', '五', '六']
  const parse = {
    yyyy: dt.getFullYear(),
    MM: dt.getMonth() + 1,
    dd: dt.getDate(),
    HH: dt.getHours(),
    mm: dt.getMinutes(),
    ss: dt.getSeconds(),
    星期: `星期${WeekTextMap[dt.getDay()]}`,
    YYYY: 0,
    DD: 0
  }

  parse.YYYY = parse.yyyy
  parse.DD = parse.dd

  Object.entries(parse).forEach(([k, v]) => {
    parse[k] = String(v).padStart(2, '0')
  })

  return Object.entries(parse).reduce((prev, [k, v]) => {
    return prev.replace(k, `${v}`)
  }, format)
}

function exec(options){
  return new Promise((res, rej)=>{
    child_process.exec(options,(err, stdout)=>{
      if(err){
        rej(err)
      }else{
        res(stdout)
      }
    })
  })
}

module.exports = {
  formatTime,
  exec
}