module.exports = {
  errorCode: 200,
  msg: 'success.',
  values: {
    tasks: [
      {
        id: 20,
        type: 2,
        actionType: 1,
        key: 'task_finish_5_rides',
        name: 'Finish 5 rides',
        reward: {
          token: '25.00 GSE token',
        },
        schedule: {
          reach: 0,
          target: 3,
        },
        complete: 0,
        condition: 0,
      },
      {
        id: 20,
        type: 2,
        actionType: 1,
        key: 'task_finish_5_rides',
        name: 'Finish 5 rides',
        reward: {
          token: '25.00 GSE token',
        },
        schedule: {
          reach: 1,
          target: 4,
        },
        complete: 0,
        condition: 1,
      },
      {
        id: 20,
        type: 2,
        actionType: 1,
        key: 'task_finish_5_rides',
        name: 'Finish 5 rides',
        reward: {
          coupon: '1 coupon',
        },
        schedule: {
          reach: 5,
          target: 5,
        },
        complete: 1,
        condition: 1,
      },
      {
        id: 20,
        type: 2,
        actionType: 1,
        key: 'task_finish_5_rides',
        name: 'Finish 5 rides',
        reward: {
          bonus: '$ 1.01 bonus',
        },
        schedule: {
          reach: 1,
          target: 2,
        },
        complete: 0,
        condition: 0,
      },
      {
        id: 21,
        type: 3,
        actionType: 0,
        key: 'weekly awards',
        name: 'weekly awards',
        reward: {
          // token: 'You just received 30.00 GSE token!',
          // bonus: 'You just received $ 10.01 ofo balance!',
          coupon: 'You just received 2 coupon!',
        },
        schedule: {
          reach: 0,
          target: 1,
        },
        complete: 0,
        condition: 1,
      },
    ],
  },
};
