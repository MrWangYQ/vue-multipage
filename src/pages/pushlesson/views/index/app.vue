<template>
  <div class="pushlessons" :style="list.securityVerifySwitch ? '':'padding-bottom:20px;'">
    <div class="pushlessons-banner" v-show="list.titlePicUrl" :style="list.titlePicUrl ? '': 'padding-top: 30px;'">
      <img :src="list.titlePicUrl" alt="">
    </div>
    <div class="pushlessons-tag" v-if="tagList && tagList.length">
      <span
        v-for="(item, index) in tagList"
        :key="index"
        :class="index == defaultIndex ? 'active-span':''"
        v-show="item.roomName"
        @click="activeTagList(item, index)"
      >{{item.roomName}}</span>
    </div>
    <div class="pushlessons-title">
      <p>{{list.bootText1}}</p>
    </div>
    <div class="pushlessons-code">
      <div class="pushlessons-code-title" v-if="chatRoom">{{ chatRoom }}</div>
      <div class="pushlessons-code-image">
        <div v-show="qrCodeUrl" id="touchArea">
          <canvas class="pushlessons-canvas" id="canvas" ref="canvas"></canvas>
          <img :src="qrCodeUrl">
        </div>
        <p v-show="showError" class="pushlessons-qrcode-error">请从已选择的群进入！</p>        
      </div>
      <div class="pushlessons-code-title">{{list.bootText2}}</div>
    </div>
    <div class="pushlessons-footer" v-show="errorHide">
      <div class="exist_join" v-if="list.virtualInitCount">已有<span style="color:red;">{{list.virtualInitCount || 0}}</span>人参加</div>
      <div class="Countdown" v-if="countDown">仅剩
        <span class="pushlessons-footer-time">{{ countDown }}</span>  
      </div>
      <div class="prompt" v-if="list.securityVerifySwitch"><i class="iconfont icon-anquan"></i>该二维码以通过安全检测</div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import Api from '../../services/apilist';
import Ip from '@/utils/gtag';
import getQueryUrl from '@/utils/getHashParameters';

let defaultURL = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452472153645056.jpg';
let classImage = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452473071206400.jpeg';

export default {
  name: 'pushlessons',
  data: () => ({
    defaultIndex: -1,                       // 默认值
    tagList: [],                          // 标签
    list :{
      title: '',                              // 标题
      titlePicUrl: '',                            // banner图
      bootText1: '',                           // 引导图1
      bootText2: '',                           // 引导图2
      virtualInitCount: 0,                             // 参与人数
      endTime: '',                                // 结束时间
      currentTime: '',                            //  当前时间
      securityVerifySwitch: false,                // 安全提醒开关
    },
    tagNumber: '',                            // 当前选中的 tag
    errorHide: false,                       // 隐藏
    countDown: '',                          // 倒计时
    qrCodeUrl: '',                          // url
    showError: false,                       // 显示错误
    chatRoom: '',                                 // 群名称

    activityNumber: '',                     // 当前活动 id
    source: '',                             // 当前
    appId: '',                              
    pageType: '',                           // 当前页面
    dyc: '',                                // 推课 id
  }),
  created() {
    // 加载数据
    this.init();
  },
  mounted() {
    let that = this;

    this.longPress('touchArea', () => {
      if (!that.qrCodeUrl) return;
      this.updateDiscernCount({ activityNumber: this.activityNumber, tagNumber: this.tagNumber });
    });
  },
  methods: {
    /**
     * 加载数据
     */
    init() {
      // 取 URL 值
      this.activityNumber = getQueryUrl('activityNumber');
      this.source = getQueryUrl('source');
      this.appId = getQueryUrl('appid');
      this.pageType = getQueryUrl('pageType');
      this.dyc = getQueryUrl('dyc');

      // 获取页面配置信息 
      this.queryPageSetting();
      // 埋点
      this.gtag();
      // 获取标签信息
      this.GetQRCode({ source: this.source, activityNumber: this.activityNumber, pageType: this.pageType, page: this.page, dynamicCodeId: this.dyc });
    },
    
    /**
     * 获取 页面 配置信息
     */
    queryPageSetting() {
      let params = { dynamicCodeId: this.dyc };
      
      try {
        // let { data, code, msg } = await this.$api.queryPageSetting(params);

        this.$http.post(
          { api: Api.queryPageSetting, type: 'fromdata' },
          params,
          function success(res) {
            let { data, code, msg } = res;
            if (code == 200) {
              // 数据
              this.list = data;

              document.title = data.titile || '';
              // 倒计时
              this.countTime();
            } else {
              console.log(error);
            }
          },
          function fail(error) {
            console.log(error);
          },
        )

        
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取二维码
     */
    activeTagList(item, index) {
      // 点击事件 根据 点击返回参数 决定有没有二维码
      // 获取默认 地址 id 
      let defaultIndex = this.defaultIndex;
      let { tagNumber, chatRoom, roomName } = item;
      let params = {};
      if (defaultIndex == index) return false; 

      this.tagNumber = tagNumber;
      this.defaultIndex = index;
      this.qrCodeUrl = '';
      this.gtag();

      // this.chatRoom = chatRoom;
      try {
        MtaH5.clickStat('tag_click',{'params': `测试统计${chatRoom} - ${ roomName } - ${tagNumber}`})
      } catch (error) {
        console.log(error);
      }

      params = {
        activityNumber: this.activityNumber,
        tagNumber: tagNumber,
        unionId: '',
        appId: this.appId,
        source: this.source,
        chatRoom: chatRoom,
        pageType: this.pageType,
        page: this.page,
        dynamicCodeId: this.dyc,
      }
      this.tagName = roomName;
      // 获取每个 Tag 的群参数
      this.queryFissionQr(params, item);
    },
    /**
     * 
     */
    // 点击标签 获取 二维码
    queryFissionQr(params, item) {
      try {
        // let { data, code, msg } = await this.$api.queryFissionQr(params);

        this.$http.post(
          { api: Api.queryFissionQr, type: 'fromdata' },
          params,
          function success(res) {
            let { data, code, msg } = res;

            if (code == 200) {
              //  catch  是否异常
              // 判断手机系统版本
              try {
                this.handleOS(data);
              } catch (error) {
                console.log(error);
              }
              this.FissionQRStatus(data, item)
            } else {
              this.qrCodeUrl = defaultURL;
            }
          },
          function fail(error) {

          },
        )
      } catch (error) {
        this.qrCodeUrl = defaultURL;
      }
    },
    /**
     * 倒计时
     */
     // 倒计时
    countTime () {
      let { currentTime, endTime = new Date() } = this.list;
      
      let timers = null;
      let that = this;
      let NewCurrentTime = currentTime.replace(/-/g, "/");
      let date1 = new Date(NewCurrentTime); //开始时间

      let NewEndTime = endTime.replace(/-/g, "/");
      let date2 = new Date(NewEndTime); //结束时间

      let date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
      
      let intDiff = parseInt(date3 / 1000);//倒计时总秒数量

      function timer(intDiff) {
        timers = window.setInterval(function () {
          let day = 0;
          let hour = 0;
          let minute = 0;
          let second = 0;//时间默认值
          let text = '';

          if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
          } else {
            clearInterval(timers);
          }
          if (minute <= 9) minute = '0' + minute;
          if (second <= 9) second = '0' + second;

          if (day) {
            text += day +'天';
          }
          if (hour) {
            text += hour +'时';
          }
          if (minute) {
            text += minute +'分';
          }
          if (second) {
            text += second +'秒';
          }
          that.countDown = text;
          intDiff--;
        }, 1000);
      }
      timer(intDiff)
    },
    // 埋点
    gtag() {
      let { activityNumber, source,  appId, pageType, page, tagNumber } = this;
      let params = {
        activityNumber,
        channelId: source,
        page,
        tagNumber,
        appId,
        pageType,
      }
      try {
        
        this.$http.post({ api: Ip.gtagIp +''+ Api.fissionActivity, type: 'json' }, params);
      } catch (error) {
        console.log(error.message);
      }
    },
    /**
     * 根链接地址 生成 二维码
     */
    useqrcode(url) {
      if (!url) return;
      // 获取 dom 默认公众号图片地址
      let canvas = this.$refs.canvas;
      // 转换二维码
      this.qrCodeUrl = '';
      QRCode.toCanvas(canvas, url, error => {
        if (error) { // 抛出异常
          console.error(error.message);
        }
        // 取到 对应的值 并展示
        let qrcode = canvas.toDataURL();
        
        this.qrCodeUrl = qrcode;
      });
      
    },
    /**
     * 关闭标题 群头像 群昵称
     */
    errorHideFun(flag) {
      this.errorHide = flag;
    },
    // 重置
    setDefaultURL(url = '') {
      this.defaultData = {};
      this.defaultIndex = 0;
      this.errorHide = false;
      this.qrCodeUrl = url || defaultURL;
    },
    // 路由跳转
    RouterGO(toPath) {
      let origin = window.location.origin;
      
      if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
        window.location.href = origin + '/#' + toPath;
      } else {
        this.$router.push({ path: toPath })
      }
    },
    // 请求数据
    GetQRCode(params) {
      // this.$bus.$emit('loading', true);
      try {
        // let { data, code, msg } = await this.$api.queryFissionActivity(params);
        this.$http.post(
          { api: Api.queryFissionActivity, type: 'fromdata' },
          params,
          function success(res) {
            let { data, code, msg } = res;
            let { systemVersion } = data;

            if (code == 200) {
              
              // 判断手机系统版本
              try {
                this.handleOS(data);
              } catch (error) {
                console.log(error);
              }

              this.catchStatus(data);
            } else {
              this.RouterGO('/error');
            }
          },
          function fail(error) {

          },
        )

        
      } catch (error) {
        this.RouterGO('/error');
      } finally {
        // this.$bus.$emit('loading', false);
      }
    },
    // 获取 微信 status 状态
    FissionQRStatus(data = {}, item) {
      let { status, detail, shortUrl, scope, appId, restrictUrl = '', restrictTitle = '' } = data;
      this.showError = false;

      switch (Number(status)) {
        case 0:
          // 新增 限制页面
          this.RouterGO('/limit');
          break;
        case 1:
          if (detail) {
            try {
              MtaH5.clickStat('h5',{'tagclick': 'true'});
            } catch (error) {
              console.log(error);            
            }
            this.useqrcode(detail);
          } else {
            this.setDefaultURL();
          }
          break;
        case 2:
          this.setDefaultURL();
          break;
        case 3:
          //  触发黑名单  触发 无权限 操作
          document.title = '无权限';
          this.RouterGO('/auth');
          break;
        case 4:
          // console.log('手动授权');
          if (shortUrl) {
            window.location.href = shortUrl;
          }
          break;
        case 5:
          // console.log('今天参加的活动太多，请明天重试!');
          this.showError = true;
          break;
        default:
          this.setDefaultURL()
          break;
      }
    },
    // 获取群 catch 状态 值 做出不同响应
    catchStatus(data = {}) {
      
      let { type, noTagDes = {}, status, tagDes, activityName = '', shortUrl = '', restrictUrl = '', restrictTitle = '' } = data;
      let newData = [];
      let qrCodeUrl = '';
      let tagName = '';

      switch (Number(status)) {
        case 0:
          // 新增 限制页面
          this.RouterGO('/limit');
          break;
        case 1:
          // 有标签
          if (type == 1) {
            if (tagDes) {
              newData = tagDes;
              this.qrCodeUrl = classImage;
              this.errorHide = true;
            } else {
              this.setDefaultURL();
            }

          } else {
            this.setDefaultURL();
          }
          break;
        case 2:
          // 活动已关闭   显示公众号 二维码
          this.setDefaultURL();
          break;
        case 3:
          //  触发黑名单  触发 无权限 操作
          document.title = '无权限';
          this.RouterGO('/auth');
          break;
        case 4:
          console.log('手动授权');
          if (shortUrl) {
            window.location.href = shortUrl;
          }
          break;
        default:
          this.setDefaultURL();
          break;
      }

      // document.title = activityName;
      this.tagList = newData;
    },
    /**
     * 检验系统版本
     */
    handleOS({systemVersion}) {
      // 验证 Android 版本  低于 6  进入限制页面  其他正常显示
      let ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(navigator.userAgent)) {
        let test = /android\s([\w.]+)/;//IE
        let match = test.exec(ua);
        let version = parseInt(match[1].split(".")[0]);
        let systemVersionNum = parseInt(systemVersion.split(".")[0]) 

        if(version <= systemVersionNum){
          this.setDefaultURL(restrictUrl);
          document.title = 'limit';
          this.RouterGO('/limit');
        }
      }
    },
    /**
     * 长按识别统计人数
     */
    updateDiscernCount(params) {
      try {
        // let { data, code, msg } = await this.$api.updateDiscernCount(params);
        this.$http.post(
          { api: Api.updateDiscernCount, type: 'fromdata' },
          params,
          function success(res) {
            let { data, code, msg } = res;

            if (code == 200) {
              console.log('识别成功');
            }
          },
          function fail(error) {

          },
        )

        
      } catch (error) {
        console.log(error.message);
      }
    },
    /**
     * 长按识别 统计
     */
    longPress(id, func,timeout=1000) {
      var timeOutEvent;    
      document.querySelector('#' + id).addEventListener('touchstart', function (e) {
          // 开启定时器前先清除定时器，防止重复触发
          clearTimeout(timeOutEvent);
          // 开启延时定时器
          timeOutEvent = setTimeout(function () {
              // 调用长按之后的逻辑函数func
              func();
          }, timeout); 
      });
      
      document.querySelector('#' + id).addEventListener('touchmove', function (e) {
          // 长按过程中，手指是不能移动的，若移动则清除定时器，中断长按逻辑
          clearTimeout(timeOutEvent);
          /* e.preventDefault() --> 若阻止默认事件，则在长按元素上滑动时，页面是不滚动的，按需求设置吧 */
      });
      
      document.querySelector('#' + id).addEventListener('touchend', function (e) {
          // 若手指离开屏幕时，时间小于我们设置的长按时间，则为点击事件，清除定时器，结束长按逻辑
          clearTimeout(timeOutEvent);
      });
    },
  }
}

</script>

<style lang='scss' scoped>
.pushlessons {
  box-sizing: border-box;
  background-color: #fff;
  font-size: 14px;
  &-banner {
    height: 210px;
    box-sizing: border-box;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  &-tag {
    padding: 10px 12px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    span {
      width: 30%;
      color: #2dbf6e;
      background: #f1fbf5;
      text-align: center;
      margin: 10px 10px 0 0;
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 5px;
    }
    .active-span {
      color: #ffffff;
      background: #53de91;
    }
  }
  &-title {
    margin: 12px;
    padding-left: 10px;
    border-left: 3px solid red;
    color: red;
  }
  &-code {
    text-align: center;
    &-title {
      padding: 10px 0px;
      box-sizing: border-box;
    }
    &-image {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      box-sizing: border-box;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &-qrcode {
    &-error {
      margin: 0 auto;
      width: 200px;
      height: 200px;
      line-height: 200px;
      font-size: 14px;
      text-align: center;
      border-radius: 5px;
      background: #efeeee;
    }
  }
  &-canvas {
    display: none;
  }
  &-footer {
    text-align: center;
    & > div {
      padding: 5px 0;
      box-sizing: border-box;
    }
    .prompt {
      padding: 15px 0 30px;
      box-sizing: border-box;
      color: green;
    }
    &-time {
      display: inline-block;
    }
  }
}
</style>