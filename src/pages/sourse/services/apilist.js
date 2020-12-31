let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/api';
}

const apiList = {
  ssResourceRenewal: baseURL + '/api/ss/resource/renewal',
  resourceShare: baseURL + '/api/ss/resource/share',
  resourceQueryResource: baseURL + '/api/ss/resource/queryResource',
  getOpProjectListWithField: '//junior.51talk.com/Mobile/OpProject/getOpProjectListWithField',
  getProjectBaseInfo: '//junior.51talk.com/Mobile/OpProject/getProjectBaseInfo',
  saveConfValueByField: '//junior.51talk.com/Mobile/OpProject/saveConfValueByField',
  ResourceLog: baseURL + '/api/ss/resource/log',
  getOpProjectInfo: '//junior.51talk.com/Mobile/OpProject/getOpProjectInfo',
  OpProjectRecordAmount: '//junior.51talk.com/Mobile/OpProject/recordAmount',
}

export default apiList;
