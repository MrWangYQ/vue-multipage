<template>
  <div class="container" ref="container">
    <p class="header-tips" v-if="errorHide">
      <img src="https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452473677332480.png">
      <span>💯{{ groupName }}</span>
    </p>
    <div class="header" v-if="defaultData.type == 1">
      <div class="header-content" v-if="hiddenHeader">
        <div class="header-tab" v-if="defaultData.tagDes.length">
          <button
            type="button"
            class="tab-button"
            :class="index == defaultIndex ? 'tab-active': ''"
            @click="active(index, item)"
            v-for="(item, index) in defaultData.tagDes"
            :key="index"
          >{{ item.roomName }}</button>
        </div>
        <div
          class="header-content-bottom"
          v-if="defaultIndex == -1"
        >👆👆请在上方选择需要的年级或课程👆👆</div>
      </div>
    </div>
    <div
      class="content"
      :class="{ 'content-title': defaultData.type == 2 || !defaultData.type }">
      <div class="content-qrcode">
        <p v-if="tagName" class="content-qrcode-tips">【{{ tagName }}】</p>
        <div class="content-qrcode-image">
          <div
            v-show="qrCodeUrl"
            :class="{ 'class-image': defaultIndex == -1 }">
            <canvas class="content-canvas" id="canvas" ref="canvas"></canvas>
            <img :src="qrCodeUrl">
          </div>
          <p v-show="showError" class="content-qrcode-error">请从已选择的群进入！</p>
        </div>
      </div>
      <div v-if="defaultIndex != -1" class="content-tips">
        <p v-if="[1, 2].indexOf(defaultData.type) !== -1">长按识别二维码入群</p>
        <p v-else>
          <span>此活动已经结束啦!</span>
          <span>关注公众号了解更多活动</span>
        </p>
      </div>
    </div>
    <div
      class="footer"
      v-if="[1, 2].indexOf(defaultData.type) !== -1">
      <p v-if="defaultIndex != -1"><i class="iconfont icon-anquan"></i>此二维码已通过验证</p>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import Api from '@/api/apijson';
import Ip from '@/utils/gtag.js';
import getQueryUrl from '@/utils/getHashParameters';

let defaultURL = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452472153645056.jpg';
let classImage = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/452473071206400.jpeg';

export default {
  name: "index",
  data() {
    return {
      qrCodeUrl: '',                    // 默认图片
      defaultIndex: -1,                 // 默认下标
      defaultData: '',                  // 默认参数
      hiddenHeader: true,              // 隐藏头部标签
      errorHide: false,                 // 失败 错误，请求失败 展示
      showError: false,               // 展示 频繁
      groupName: '',                  // 活动名
      tagName: '',                      // 标签名 
      // appId: '',                              //  appid
      source: '',                             // source
      activityNumber: '',                       // number
      // openId: '',                             // openid
      type: '',                               // 有无标签
      pageType: '',                           // 渠道区分
      page: window.location.hostname,             // 域名
    };
  },
  computed: {
    // 获取 token
    // token() {
    //   return this.$store.state.token;
    // },
    PhoneTerminal() {     // 手机终端
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      // let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      return isAndroid;
    }
  },
  created() {
    // try {
    //   MtaH5.clickStat('h5',{'pv':'true'})
    // } catch (error) {
    //   console.log(error);
    // }
    // // 取 URL 值
    this.activityNumber = getQueryUrl('activityNumber');
    this.source = getQueryUrl('source');
    this.appId = getQueryUrl('appId');
    this.pageType = getQueryUrl('pageType');

    this.GetQRCode({ source: this.source, activityNumber: this.activityNumber, pageType: this.pageType, page: this.page });
    this.gtag();
  },
  methods: {
    // 埋点
    gtag(tagNumber = '') {
      let { activityNumber, source,  appId, pageType, page } = this;
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
    //  标签切换
    active(idx, item) {
      // 点击事件 根据 点击返回参数 决定有没有二维码
      // 获取默认 地址 id 
      let defaultIndex = this.defaultIndex;
      let params = {};
      if (defaultIndex == idx) return false; 

      this.defaultIndex = idx;
      this.qrCodeUrl = '';
      this.gtag(item.tagNumber);
      try {
        // MtaH5.clickStat('tag_click',{'params': `测试统计${item.chatRoom} - ${ item.roomName } - ${item.tagNumber}`})
      } catch (error) {
        console.log(error);
      }

      params = {
        activityNumber: this.activityNumber,
        tagNumber: item.tagNumber,
        unionId: '',
        appId: this.appId,
        source: this.source,
        chatRoom: item.chatRoom,
        pageType: this.pageType,
        page: this.page,
      }
      this.tagName = item.roomName;
      // 获取每个 Tag 的群参数
      this.queryFissionQr(params, item);
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
    // 点击标签 获取 二维码
    async queryFissionQr(params, item) {
      try {
        let { data, code, msg } = await this.$api.queryFissionQr(params);

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
      } catch (error) {
        this.qrCodeUrl = defaultURL;
      }
    },
    // 请求数据
    async GetQRCode(params) {
      // this.$bus.$emit('loading', true);
      try {
        // let { data, code, msg } = await this.$api.queryFissionActivity(params);
        let { data, code, msg } = {
            "code": 200,
            "data": {
              "tagDes": [{
                "chatRoom": "8C52086A04B732C2C25A195CD427DDA7B5B32EF42ACD5F44F7CDFBA75FCD9C0F",
                "roomName": "3-8岁",
                "tagNumber": 451112632790528,
                "dynamicCodeQrId": null,
                "sysGroup": false
              }],
              "type": 1,
              "status": 1,
              "activityName": "启蒙礼包福利群",
              "appId": "",
              "shortUrl": "",
              "scope": "",
              "noTagDes": null,
              "restrictUrl": "",
              "restrictTitle": "",
              "systemVersion": "5.0.0"
            },
            "msg": ""
          }
        let { systemVersion } = data;

        if (code == 200) {
          
          // 判断手机系统版本
          // try {
          //   this.handleOS(data);
          // } catch (error) {
          //   console.log(error);
          // }

          this.catchStatus(data);
        } else {
          console.log(307);
          // this.RouterGO('/error');
        }
      } catch (error) {
          console.log(error, 311);

        // this.RouterGO('/error');
      } finally {
        console.log('error', 315);
        // this.$bus.$emit('loading', false);
      }
    },
    // 获取 微信 status 状态
    FissionQRStatus(data = {}, item) {
      let { status, detail, shortUrl, scope, appId, restrictUrl = '', restrictTitle = '', blackQrUrl = '' } = data;
      this.showError = false;

      switch (Number(status)) {
        case 0:
          // 新增 限制页面
          this.RouterGO('/limit');
          break;
        case 1:
          if (detail) {
            try {
              // MtaH5.clickStat('h5',{'tagclick': 'true'});
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
          // document.title = '无权限';
          localStorage.setItem('url', blackQrUrl);

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
        // case 6: 
          // this.useqrcode(restrictUrl);
          // document.title = restrictTitle;
          // break;
        default:
          this.setDefaultURL()
          break;
      }
    },
    // 获取群 catch 状态 值 做出不同响应
    catchStatus(data = {}) {
      
      let { type, noTagDes = {}, status, tagDes, activityName = '', shortUrl = '', restrictUrl = '', restrictTitle = '', blackQrUrl = '' } = data;
      let newData = {};
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
              newData = data;
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
          // document.title = '无权限';
          // this.RouterGO('/auth');
          localStorage.setItem('title', activityName);

          localStorage.setItem('url', blackQrUrl);

          this.RouterGO('/auth');
          break;
        case 4:
          console.log('手动授权');
          if (shortUrl) {
            window.location.href = shortUrl;
          }
          break;
        // case 6:
        //   this.useqrcode(restrictUrl);
        //   activityName = restrictTitle;
        //   break;
        default:
          this.setDefaultURL();
          break;
      }

      this.groupName = activityName;
      document.title = activityName;
      // 兼容一个标签 直接展示二位码
      if (tagDes && tagDes.length == 1) {
        this.active(0, tagDes[0]);
      }
      this.defaultData = newData;
    },
    handleOS({systemVersion}) {
      // 验证 Android 版本  低于 6  进入限制页面  其他正常显示
      let ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(navigator.userAgent)) {
        let test = /android\s([\w.]+)/;//IE
        let match = test.exec(ua);
        let version = parseInt(match[1].split(".")[0]);
        let systemVersionNum = parseInt(systemVersion.split(".")[0]) 

        if(version <= systemVersionNum){
          // this.setDefaultURL(restrictUrl);
          document.title = 'limit';
          this.RouterGO('/limit');
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$padding: 10px;

.container {
  overflow:auto;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0 12px;
  .header {
    width: 100%;
    background: #ffffff;
    &-content {
      box-sizing: border-box;
      width: 100%;
      &-bottom {
        width: 100%;
        font-size: 14px;
        line-height: 40px;
        margin-top: $padding;
        text-align: center;
      }
    }
    &-tips {
      font-weight: 700;
      font-size: 20px;
      padding: 5px 0;
      img {
        width: 60px;
        height: 60px;
        vertical-align: middle;
      }
    }
    .header-tab {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
    }
    .tab-button {
      width: 31%;
      font-size: 12px;
      color: #2dbf6e;
      background: #f1fbf5;
      padding: 5px 2px;
      margin: 10px 3% 0 0;
      outline: none;
      border: none;
      border-radius: 5px;
      box-sizing: border-box;
      text-align: center;
      &:nth-child(3n){
        margin-right: 0;
      }
    }
    .tab-active {
      color: #ffffff;
      background: #53de91;
    }
  }
  .content {
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
    &-padding {
      padding: $padding;
      box-sizing: border-box;
    }
    &-qrcode {
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      &-tips {
        text-align: center;
        font-size: 18px;
        line-height: 40px;
      }
      &-image {
        width: 260px;
        height: 260px;
        margin: 0 auto;
        img {
          width: 100%;
          border-radius: 5px;
        }
      }
      &-error {
        margin: 0 auto;
        width: 240px;
        height: 240px;
        font-size: 14px;
        line-height: 240px;
        text-align: center;
        border-radius: 5px;
        background: #efeeee;
      }
      .class-image {
        text-align: center;
        line-height: 240px;
        img {
          width: 60%;
        }
      }
    }
    &-tips {
      text-align: center;
      // margin-top: -15px;
      padding-bottom: $padding;
      font-size: 14px;
    }
    &-canvas {
      display: none;
    }
  }
  .content-title {
    margin-top: 50px;
  }
  .footer {
    padding: 10px 20px;
    border-radius: 5px;
    color: green;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
}
</style>