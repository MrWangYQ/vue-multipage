let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/api';
}

const apiList = {
  activityQueryRankList: baseURL + '/api/mp/activity/queryRankList',
  activityQueryUserFollowList: baseURL + '/api/mp/activity/queryUserFollowList',
  activityQueryUserTarget: baseURL + '/api/mp/activity/queryUserTarget',
}

export default apiList;
