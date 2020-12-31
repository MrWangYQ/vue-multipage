import getQueryUrl from './getHashParameters';
// 腾讯 埋点
let sid = "500695318";
let cid = "500695319";
let flag = false;
let GetParamsChannel = 'saleH5';
let MtaChannel = '';
try {
  GetParamsChannel = getQueryUrl('channel') || 'saleH5';
  MtaChannel = getQueryUrl('channel') || 'default';

} catch (error) {
  console.log(error, '10');
}
let channelEnv = GetParamsChannel + '-on-test';
let channelDebuggerFlag = true;

if (/\b(sale)\b/.test(location.href)) {
  flag = true;
}

if (/\b(kid.51talk.com)\b/.test(location.href)) {
  // 腾讯  
  sid = "500695154";
  cid = "500695161";

  // 极光
  channelEnv = GetParamsChannel + '-on-line';
  channelDebuggerFlag = false;
}

var _mtac = {};

(function () {
  var mta = document.createElement("script");
  mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
  mta.setAttribute("name", "MTAH5");
  mta.setAttribute("sid", sid);
  mta.setAttribute("cid", cid);
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(mta, s);
})();


var CountEvent, BrowseEvent, CalculateEvent;

(function () {
  window.JAnalyticsInterface.init({
    appkey: "caa7057f9be742050fe0657a", // 极光官网中创建应用后分配的 appkey，必填
    debugMode: false, // 设置是否开启 debug 模式。true 则会打印更多的日志信息。设置 false 则只会输出 w、e 级别的日志。
    channel: channelEnv, // 渠道名称，默认值为:default-channel
    loc: false, //设置是否尝试获取位置信息上报，默认为 true
    singlePage: true //设置是否为单页面，默认为 false
  });

  CountEvent = window.JAnalyticsInterface.Event.CountEvent;
  BrowseEvent = window.JAnalyticsInterface.Event.BrowseEvent;
  CalculateEvent = window.JAnalyticsInterface.Event.CalculateEvent;
})()

function buriedPointFun(key, value, type) {
  let Params = {};
  let ChannelKey = getKey(MtaChannel) + 'funnel';   // 漏斗 渠道
  let ClickKey = getKey(key);                  //   自定义事件
  let NewKey = ClickKey + getKey(MtaChannel);        //  漏斗 事件 Id
  

  Params[NewKey] = 'true';
  
  if (type === 'CountEvent') {
    try {
      console.log(ClickKey, 'MtaChannel--', MtaChannel);
      //事件
      MtaH5.clickStat(ClickKey, { 'channel': MtaChannel })
    } catch (error) {
      console.log(error);
    }
    try {
      console.log(ChannelKey, 'Params--', Params)

      //漏斗
      MtaH5.clickStat(ChannelKey, Params);
    } catch (error) {
      console.log(error);
    }

    // try {
    //   //漏斗
    //   MtaH5.clickStat('allfunneldefaulta', Params)
    // } catch (error) {
    //   console.log(error);
    // }

    // try {
    //   let defaultKey = 'defaultb';
    //   //漏斗
    //   MtaH5.clickStat('allfunnel' + defaultKey, Params)
    // } catch (error) {
    //   console.log(error);
    // }


    try {
      let Params = {};
      NewKey = ClickKey + 'all';
      Params[NewKey] = 'true';

      console.log(ChannelKey, 'all')
      //漏斗
      MtaH5.clickStat('allfunnel', Params)
    } catch (error) {
      console.log(error);
    }
  }


  if (type === 'CalculateEvent') {
    try {
      window.JAnalyticsInterface.onEvent(new CalculateEvent(key, value));
    } catch (error) {
      console.log(error);
    }

  }
}

//key值转换

function getKey(key) {
  let str = key.replace(/[^a-zA-Z0-9]/g, '');
  return str.toLocaleLowerCase();
}

export {
  buriedPointFun
}


