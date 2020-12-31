module.exports = {
  errorCode: 200,
  msg: "succ",
  values: {
    title: "feedback",
    button: [
      {
        name: "SUBMIT",
        label: "SUBMIT"
      }
    ],
    list: [
      {
        question: '问题问题问题问题问题问题问题问题',
        question_id: 1,
        type: "radio", // 单选（radio）、多选（checkbox）
        options: [
          {
            option_id: 1,
            option: "test1test1test"
          },
          {
            option_id: 2,
            option: "test2"
          }
        ]
      }, {
        question: '多选问题2',
        question_id: 2,
        type: "checkbox", // 单选（radio）、多选（checkbox）
        options: [
          {
            option_id: 1,
            option: "an1"
          },
          {
            option_id: 2,
            option: "an2"
          }
        ]
      }, {
        question: '多选问题3',
        question_id: 3,
        type: "checkbox", // 单选（radio）、多选（checkbox）
        options: [
          {
            option_id: 1,
            option: "an1"
          },
          {
            option_id: 2,
            option: "an2"
          },
          {
            option_id: 3,
            option: "an3"
          }
        ]
      }
    ]
  }
};
