let baseURL = '/';

if(process.env.NODE_ENV === 'development') {
  baseURL = '/api';
}

const apiList = {
  fissionActivity: '/point/fission/activity',
  submitAppPushCourses:'/api/course/submitAppPushCourse',
  queryAppPushCourseDetail:'/api/course/queryAppPushCourseDetail',
  // getProjectBaseInfo: '/Mobile/OpProject/getProjectBaseInfo',      // 验证是否登录
  getProjectBaseInfo: '//junior.51talk.com/Mobile/OpProject/getProjectBaseInfo',      // 验证是否登录
  AjaxMobileMessage: '//login.51talk.com/ajax/mobile/message',      // 获取短信
  AjaxAccessTicket: '//login.51talk.com/ajax/access/ticket',        // 请求登录许可
  AjaxStudentSignin: '//login.51talk.com/ajax/student/signin',      // 注册 / 登录
  CheckAccessticket: '//login.51talk.com/check/accessticket',      // 验证 登录 许可 / 短信验证码
  AjaxCaptcha: '//login.51talk.com/ajax/captcha/',      

  saleActivityInfo: baseURL + '/sale/api/activity/info',                  // 活动页面接口
  saleActivityFreeApply: baseURL + '/sale/api/activity/freeApply',        // 免费报名活动接口
  AuthLogin: baseURL + '/user/api/auth/login',
  AuthSmsCode: baseURL + '/user/api/auth/smsCode',
  courseGetShowSharInfo: baseURL + '/sale/api/activity/getShowShareInfo',                 // 秀一秀分享参数返回接口
}

export default apiList;