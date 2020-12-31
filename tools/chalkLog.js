const chalk = require('chalk');
// log with chalk
const chalkLog = function(options){
  options = options || {
    color: 'red',  // chalk color
    label: 'beacon',
    badge: '🎉',
    tag: 'tag',
    msg: 'some log msg',
  }
  let logLabel = options.label || 'beacon'
  let logColor = options.color || 'black'
  const logTxt = chalk.gray('['+ logLabel +'] > ') + chalk[logColor](''+ options.badge +' ') + chalk.underline(chalk[logColor](options.tag)) +'  '+ options.msg

  // console.log(logTxt)
}

module.exports = chalkLog