import wx from "weixin-js-sdk";

/**
* 音频播放时间换算
* @param {number} value - 音频当前播放时间，单位秒
*/
function transTime(value) {
  var time = "";
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
      time = formatTime(h + ":" + m + ":" + s);
  } else {
      time = formatTime(m + ":" + s);
  }

  return time;
}

/**
* 格式化时间显示，补零对齐
* eg：2:4  -->  02:04
* @param {string} value - 形如 h:m:s 的字符串 
*/
function formatTime(value) {
  var time = "";
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
      time += s[i].length == 1 ? ("0" + s[i]) : s[i];
      time += ":";
  }
  time += s[i].length == 1 ? ("0" + s[i]) : s[i];

  return time;
}

/**
 * 分享
 */
const getShareInfo = (res) => {
  wx.config({
    debug: false,
    appId: res.appId,
    timestamp: res.timestamp,
    nonceStr: res.nonceStr,
    signature: res.signature,
    jsApiList: ["checkJsApi", "updateAppMessageShareData", "updateTimelineShareData", "onMenuShareAppMessage", "onMenuShareTimeline", "hideMenuItems"]
  });

  wx.ready(function() {

    wx.updateAppMessageShareData({ // 分享好友
      title: res.shareWebPage.title, // 分享标题
      link: res.shareWebPage.webpageUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致且分享的地址不要带端口
      desc: res.shareWebPage.description,
      imgUrl: res.shareWebPage.thumbdata, // 分享图标
      type: "link", // 分享类型,music、video或link，不填默认为link
      success: function (e) {
        // 用户点击了分享后执行的回调函数
        // alert('513'+JSON.stringify(e));
      },
      cancel: function() {
        console.log("取消分享");
        // alert('取消分享503')
      },
      fail: function(e) {
        // alert('取消506'+JSON.stringify(e));
      },
      complete: function() {
        // alert('取消分享506')
      },
      trigger: function() {
        // alert('取消分享509')
      }
    });

    // //分享到朋友圈
    wx.updateTimelineShareData({
      title:  res.shareWebPage.title, // 分享时的标题
      link: res.shareWebPage.webpageUrl, // 分享时的链接
      imgUrl: res.shareWebPage.thumbdata, // 分享时的图标
      success: function() {
        console.log("分享成功");
        // alert('分享成功482');
      },
      cancel: function() {
        console.log("取消分享");
        // alert('取消分享486')
      }
    });
  });
}

export {
  transTime,
  getShareInfo,
}