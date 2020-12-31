let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/api';
}

const apiList = {
  queryPageSetting: baseURL + '/api/fission/queryPageSetting',
  queryFissionQr: baseURL + '/api/fission/queryFissionQr',
  queryFissionActivity: baseURL + '/api/fission/queryFissionActivity',
  updateDiscernCount: baseURL + '/api/fission/updateDiscernCount',
  fissionActivity: '/point/fission/activity',
}

export default apiList;