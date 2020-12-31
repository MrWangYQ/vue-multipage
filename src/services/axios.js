// 通用拦截器
import axios from "axios";
import conf from 'services/config.js'
import qs from 'querystring'

let baseUrl =  '//'+ conf.baseUrl

// http request 拦截器
axios.interceptors.request.use(config => {
    // 支持传全地址，自定义特殊地址
    if (!(/^(http|https)/.test(config.baseURL))){
      config.baseURL = baseUrl
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
axios.interceptors.response.use(response => {
    if (response.data.code && response.data.code == 200) {
      return response.data.data;
    } else {
      return Promise.resolve(response.data);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

let postFromData = function (url, data, config) {
  let qsData = ''
  if (data.constructor === Object) {
    qsData = qs.stringify(data)
  }
  return axios.post(url, qsData, config)
}

const getData = function getData(url, data, config) {
  return axios.get(url, data, config);
};

export {
  postFromData,
  getData,
};

export default axios
