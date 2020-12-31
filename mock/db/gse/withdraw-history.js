const Mock = require('mockjs');

module.exports = Mock.mock({
  errorCode: 200,
  msg: 'sucess',
  values: {
    total: 100,
    pageSize: 20,
    'list|20': [{
      'withdraw_token|1-100.1-10': 1,
      'address|1-20': 'x',
      createtime: 1529745944173,
      'status|1-3': 1, // 1.操作中；2:成功；3：失败
    }],
  },
});
