let base = require('../services/config');

let Ip = {
  gtagIp: '',
}

if(process.env.NODE_ENV === 'development') {
  Ip.gtagIp = base.baseUrl;
}

export default Ip;