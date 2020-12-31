/**
 * 初始化项目结构
 */
let shell = require('shelljs');
let inquirer = require('inquirer');
const chalkLog = require('./chalkLog');

const askQuestion = async () => {
  // 模板类型
  let { templateType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateType',
      message: 'Which template do you want?',
      choices: [
        {
          name: 'SPA (Single page)',
          value: 'SPA'
        },
        {
          name: 'MPA (Multiple page)',
          value: 'MPA'
        }
      ]
    }
  ])
  // console.log('templateType', templateType)

  // 项目名称
  let { projectName } = await inquirer.prompt([
    {
      name: 'projectName',
      message: 'What\'s the project name',
    }
  ])
  // console.log('projectName', projectName)

  // type: singlePage || multiPage
  let copyPath = (obj = { type: 'singlePage' }) => {
    let { type } = obj
    
    // 目录不能重复
    if (shell.test('-e', '../src/pages/'+ projectName)) {
      chalkLog({
        color: 'red',
        badge: '😭😭😭',
        tag: 'Error',
        msg: ('Project name "'+ projectName +'" exists!')
      })

      return;
    }
    let sourcePath = '../src/pages/'+ type
    shell.cp('-R', sourcePath, '../src/pages/'+ projectName);

    chalkLog({
      color: 'green',
      badge: '😁😁😁',
      tag: 'Success',
      msg: ('Project "'+ projectName +'" init done!')
    })
  }

  switch (templateType) {
    case 'SPA': // 单页
      copyPath()
      break;
    case 'MPA': // 多页
      copyPath({
        type: 'multiPage'
      })
      break;
  }

}

askQuestion().catch((err) => {
  console.log('init project err: ', err)
})