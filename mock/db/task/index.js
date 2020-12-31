const Mock = require('mockjs');
const v2TaskList = require('./v2-task-list');
const v2TaskAwardWeek = require('./v2-task-award-week');

module.exports = {
  v2TaskList,
  v2TaskAwardWeek,
  taskList: Mock.mock({
    errorCode: 200,
    msg: 'success',
    values: {
      tasks: [
        {
          id: 3,
          type: 3,
          name: 'weekly awards',
          reward: {
            token: '30.00',
          },
          schedule: {
            reach: 0,
            target: 1,
          },
          complete: 0,
          pop: 0,
          condition: 0,
        },
        {
          id: 16,
          type: 2,
          name: 'credit_enum_4',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 1,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 0,
          actionType: 1,
        },
        {
          id: 17,
          type: 2,
          name: 'credit_enum_4',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 1,
          pop: 0,
          condition: 1,
          actionType: 3,
        },
        {
          id: 18,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
        {
          id: 20,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
        {
          id: 21,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
        {
          id: 22,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
        {
          id: 23,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
        {
          id: 24,
          type: 2,
          name: 'credit_enum_3',
          reward: {
            token: '25.00',
          },
          schedule: {
            reach: 2,
            target: 2,
          },
          complete: 0,
          pop: 0,
          condition: 1,
          actionType: 1,
        },
      ],
    },
  }),
  taskAwardWeek: Mock.mock({
    data: {
      msg: 'success.',
    },
  }),
  taskawardItem: Mock.mock({
    errorCode: 200,
    msg: 'success',
    values: {
    },
  }),
};
