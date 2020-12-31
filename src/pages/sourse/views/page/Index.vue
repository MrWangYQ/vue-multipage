<template>
  <div class="resourse">
    <!-- 消息框 -->
    <Tips :tipvisible.sync='tipvisible'>{{ errorText }}</Tips>
    <Login
      :login.sync="loginVisible"
      :loginList="loginList"
      @sharePage="getSharePage"
      :juniorList="juniorList"
      :formName='formName'
    ></Login>
    <Page
      :isFooter='(resourceType == 1 || urlType == 2)'
      :style="resourceType == 1 && logged ?  '': resourceType == 1 ? 'background-color:#F5F5F5': resourceType == 4 ? 'background-image:url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453063790283264.png)':''">
      <div v-if="[4,5].indexOf(resourceType) < 0">
        <img v-if="pageList.img" :src="pageList.img">
      </div>
      <div v-if="resourceType == 4" class="video-page">
        <div class="video-controls">
          <div class="video-content">
            <div class="video-image">
              <img :src="pageList.video_img" alt="">
              <p @click="btnclick">
                <svg t="1590651371521" class="icon play_svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3023" width="200" height="200"><path d="M953.6 512L70.4 1024V0z" fill="#ffffff" p-id="3024"></path></svg>
              </p>
            </div>
            <div class="video-title">
              <span v-if="pageList.code || pageList.video_name">{{ pageList.code }}  {{ pageList.video_name }}</span>
              <p v-if="pageList.play_count"><i></i> {{ pageList.play_count }} 人已观看</p>
            </div>
          </div>
          <div class="video-dashed"></div>
          <div class="video-play">
            <div class="video-desc">
              <span v-if="pageList.video_name"><i></i>【 {{ pageList.video_name }}】</span>
              <p v-if="pageList.video_desc">{{ pageList.video_desc }}</p>
            </div>
          </div>
        </div>
        <div class="logo"></div>
      </div>

      <Curriculum
        v-if="resourceType == 5"
        :ListWidthField='ListWidthField'
        :logged='logged'
        :iscontinue='iscontinue'
        @needLogin='needLoginFun'
        @eventType='sendEventType'
      ></Curriculum>

      <div
        v-show="(resourceType == 1 || urlType == 2)"
        slot="btn"
        id="footer_btn"
        :class="(resourceType == 1 || urlType == 2) ? 'footer_btn':''">
        <button v-if="btnName" @click="btnclick">
          <span>{{btnName}}</span>
        </button>
      </div>
    </Page>
  </div>
</template>

<script>
import Tips from '@/components/Tips/index';
import wx from "weixin-js-sdk";
import { transTime } from "@/common";
import Page from "@/components/page/index";
import Login from "@/components/login/index";
import Curriculum from './curriculum';
import Api from "../../services/apilist";
import isIphoneX from '@/utils/isIphoneX';

export default {
  name: "sourse",
  components: {
    Page,
    Login,
    Curriculum,
    Tips,
  },
  data: () => ({
    btnName: "",
    nextName: "",
    loginVisible: false,
    ssResourceId: "",             
    // pageList: {"no":"20200527","video_name":"李豆豆","course_id":"111","item":"100","week":"星期三","code":"803390","play_count":"0","video_url":"http://s.kg.51talk.com/245928dc-57b6-4e9a-a6b3-bbb1a3f4f8a6.mp4","share_count":"0","duration":"92","start_time":"1590579780","video_img":"http://s.kg.51talk.com/067f869e-0478-4471-8e01-445e5e4677bd.jpg","stare_time":"1590579840","time":"19:43","day":"2020年05月27日","is_allow_share":1},
    pageList: '',
    user_id: "", // 是否正常登录
    course_review: "", // 课程回顾 url
    logged: false, // 是否登录
    resourceType: '', // 区分类型
    urlType: '',                    // 对应展示内容
    ListWidthField: [],                          // 专属课程表 列表
    iscontinue: false,                          // 是否展示 图片
    redirect: '',                           // 是否重定向
    tipvisible: false,
    errorText: '请在手机中打开!',
    loginList: {
      at: "",
      mobile: "",
      sms_code: 1,
      client: 1,
      user_id: ""
    }, // 获取短信验证码
    juniorList: {
      projectId: "", // 项目 id
      v: "", //  版本号
      t: "" //  终端名称
    },
    saveConfValue: {
      projectId: '',
      itemId: '',
      v: '',
      t: '',
      field: 'unlock_uid',
      val: '',
    },                                    // 到答案页面 调取下 上报接口
    formName: '',                       // 区分 来源 登录
  }),
  watch: {
    logged(flag) {
      let { ssResourceId, urlType, resourceType } = this;
      let params = { ssResourceId, urlType, login: true };
      

      if (flag && resourceType != 5) {
        // 登录 记 到答案页面
        this.RouterGO('/logged', params)
      } else {
        this.iscontinue = true;
      }
    },
  },
  created() {
    try {
      // 获取参数
      this.ssResourceId = this.getQueryUrl("ssResourceId");
      this.urlType = this.getQueryUrl("urlType") || 1;
      this.redirect = this.getQueryUrl('redirect') || '';

      if (!this.redirect) {
        this.ssResourceRenewal({ url: window.location.href + '&redirect=1' })
      }
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    let { resourceType, urlType } = this;
    let event = 0;

    // 桌面微信
    let isPc = /macintosh|window/.test(navigator.userAgent.toLowerCase());

    if (isPc) {
        this.tipvisible = true;
    }
    
    this.resourceQueryResource({ number: this.ssResourceId });
    this.resourceLog({ number: this.ssResourceId, event });
    // 获取设置
    this.$nextTick(() => {
      
      // // // 提前预制分享
      this.share();
      
    })
  },
  methods: {
    /**
     * 是否为 苹果手机
     */
    isIphone({ resourceType, urlType }) {
        /* 函数使用 */
      if(isIphoneX()){
        let pageFooter = document.getElementById('page-footer');
        let footer_btn = document.getElementById('footer_btn');
        let pageContent = document.getElementById('page-content');

        if (resourceType == 1 || urlType == 2) {
        
          pageFooter.className = 'page-footer iphonex_page_footer';
          footer_btn.className = 'footer_btn iphonex_footer_btn';
        }

        if (resourceType == 5) {
            pageContent.className = 'page-content page-content-padding';
        }
      }
    },
    /**
     * 是否登录
     */
    needLoginFun(flag) {
      // console.log(flag, 155);
      this.btnclick();
    },
    /**
     * 续期token
     */
    async ssResourceRenewal(params) {
      try {
        let { data } = await this.$api.ssResourceRenewal(params);

        console.log(data);
        
      } catch (error) {
        
      }
    },
    /**
     * 点击按钮
     */
    btnclick() {
      // 以登录 点击分享 未登录 获取登录信息
      let { logged, resourceType } = this;
      let event = '';

      if (!logged) {
        // 检测是否登录
        // this.loginVisible = true;
        this.getProjectBaseInfo(this.juniorList);
        if (resourceType == 3) {  // 查看答案
          event = 1;
        } else if (resourceType == 2) { // 查看建议
          event = 3;
        } else if (resourceType == 1) { // 听音学习
          event = 2;
        } 
        // else if (resourceType == 5) {
        //   event = 5
        // }
        if (event) {
          this.resourceLog({ number: this.ssResourceId, event });
        }
      }
    },
    /**
     * 点击预约 统计 一对一  公开课
     */
    sendEventType(eventType) {
      this.resourceLog({ number: this.ssResourceId, event: eventType });
    },
    /**
     * 课程回顾 跳转
     */
    selfClass() {
      let review = this.course_review;
      window.location.href = review+'&v='+(new Date().getTime())+Math.random();
    },
    /**
     * 分享
     */
    async share() {
      try {
        let { code, data, message } = await this.$api.resourceShare({ number: this.ssResourceId, shareUrl: window.location.href });
          if (code == 200) {
            this.getShareInfo(data);
          }
      } catch (error) {
      }
    },
    /**
     * 获取资源配置
     */
    async resourceQueryResource(params = {}) {
      try {
        let { code, data, msg } = await this.$api.resourceQueryResource(params);
        
        if (code == 200) {
          this.catchStatus(data);
        } else {
          console.log(msg);
        }
      } catch (error) {
        console.log(error+'239');
      }
    },
    /**
     * 根据总表 拉取分表列表
     */
    /**
     * 获取资源配置
     */
    async getOpProjectListWithField(params = {}) {
      try {
        let data = await this.$api.getOpProjectListWithField(params);
      } catch (error) {
        let { status, info, data } = error;
        if (status == 1) {
          // console.log(224, data);
          this.ListWidthField = data.list;
        }
      }
    },
    /**
     * 检验是否 登录
     */
    async getProjectBaseInfo(params) {
      try {
        let data = await this.$api.getProjectBaseInfo(params);
        // alert(JSON.stringify(data)+'323');
      } catch (error) {
        let { status, info, data } = error;

        if (status == 1) {
          if (data.user_id) {

            this.saveConfValue.val = data.user_id;
            this.logged = true;
          } else {
            this.loginVisible = true;
            // 获取最新的 at
            this.AjaxAccessTicket({ client: 1 });
            console.log(info);
          }
          this.loginList.user_id = data.user_id;
        }
      }
    },
    /**
     * 获取登录信息
     */
    async AjaxAccessTicket(params) {
      // alert(JSON.stringify(params)+'--275');
      try {
        let {
          data: { code, res, message }
        } = await this.$http.get(Api.AjaxAccessTicket, params);

        // let { code, res, message } = await this.$api.AjaxAccessTicket(params);

        if (code == 10000) {
          if (res && res.at) {
            this.loginList.at = res.at;
          }
        } else {
          console.log(message, "131");
        }

        // alert(this.loginList.at+'---278--'+res.at);
      } catch (error) {
        // alert('287'+JSON.stringify(error));
      }
    },
    /** 进入到 答案页面 调用 */
    async saveConfValueByField() {
      let params = this.saveConfValue;

      try {
        let { data, status, info } = await this.$api.saveConfValueByField(params);
        if (status == 1) {

        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 取 URL 的参数
     */
    getQueryUrl(key) {
      var params = this.getHashParameters();
      return params[key] || "";
    },
    /**
     * 处理 状态
     */
    catchStatus(data) {
      let {
        status,
        resourceContent,
        resourceType,
        urlType,
        shortUrl,
        v,
        t,
        projectId,
        itemId,
        previousReviewUrl,
      } = data;

      let newName = "";
      let documentTitle = "";
      let nextName = "";
      let timer = null;
      let event = 0;

      switch (Number(status)) {
        case 0:
          this.pageList = resourceContent;
          // resourceType = 1;
          Object.assign(this.juniorList, { projectId, v, t });
          Object.assign(this.saveConfValue, { projectId, itemId, v, t });

          if (resourceType == 3) {
            newName = "查看答案";
            documentTitle = "Funfacts";
            nextName = "分享趣味给好友";
          } else if (resourceType == 2) {
            newName = "查看建议";
            documentTitle = "家长拆书";
            nextName = "分享方法给好友";
          } else if (resourceType == 1) {
            newName = "听音学习";
            documentTitle = "每日一词";
            nextName = "邀好友一起学习";
          } else if (resourceType == 5) {
            this.formName = '5'
            this.getOpProjectListWithField({ projectId: resourceContent.ID, v, t, field: 'unlock_uid', pageSize: 10, order: 1 });
          }

          this.btnName = newName;
          this.nextName = nextName;
          this.course_review = previousReviewUrl;
          this.resourceType = resourceType;

          document.title = documentTitle || resourceContent.name;
          break;
        case 1:
          this.loginVisible = true;
          break;
        case 2:
          window.location.href = shortUrl;
          break;
        case 3:
        case 4:
          this.RouterGO('/error');
          break;
        default:
          this.RouterGO('/error');
          break;
      }
      this.urlType = urlType;

      // 专属课表  进页面 统计
      if (resourceType == 5) {
        event = 5;
      }
      
      // 统计
      this.resourceLog({ number: this.ssResourceId, event });
      
      this.isIphone({ resourceType, urlType });
      // 拉取最新数据
      this.getOpProjectInfo({ projectId, itemId, v, t });
    },
    /**
     * 取 URL 参数
     */
    getHashParameters() {
      try {
        let hash = location.hash || "";
        let arr = hash.split("?")[1].split("&");

        let params = {};
        for (let i = 0; i < arr.length; i++) {
          let data = arr[i].split("=");
          if (data.length === 2) {
            params[data[0]] = data[1];
          }
        }
        return params;
      } catch (error) {
        // this.RouterGO("/error");
      }
    },
    /**
     * 路由跳转
     */
    RouterGO(toPath, obj = {}) {
      let origin = window.location.origin;
      let NewPath = '';

      if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
        // if (obj.ssResourceId && obj.urlType) {
        NewPath = origin + "/#" + toPath + '?ssResourceId=' + obj.ssResourceId+'&urlType='+obj.urlType+'&login='+obj.login;
        // } else {
        //   NewPath = origin + "/#" + toPath;
        // }
        window.location.href = NewPath;
      } else {
        this.$router.push({ path: toPath , query: obj });
      }
    },
    /**
     * 获取绑定之后的分享数据
     */
    getSharePage(list) {
      // 是否登录
      this.logged = true;
    },
    /**
     * 获取日志
     */
    async resourceLog(params) {

      try {
        let { code, data, message } = await this.$api.ResourceLog(params);
        
        if (code == 200) {
          
          let { status, shortUrl } = data;

          switch (Number(status)) {
            case 0:
              
              break;
            case 1: 
              this.loginVisible = true;
              break;
            case 2:
              window.location.href = shortUrl;
              break;
            case 3:
            case 4: 
              this.RouterGO('/error');
              break;
            default:
              this.RouterGO('/error');
              break;
          }
        }
      } catch (error) {
        console.log(error);
      }
      
    },
    /**
     * 获取某一记录内容
     */
    async getOpProjectInfo(params) {
      let Newparams = {
        projectId: params.projectId,
        itemId: params.itemId,
        v: params.v,
        t: params.t
      }

      try {
        let { status, info, data } = await this.$api.getOpProjectInfo(Newparams);
      } catch (error) {
        let { status, info, data } = error;

        if (status == 1) {
          if (data) {
            this.pageList.play_count = data.play_count || 0;
          }
        } else {
          console.log(info, "131");
        }
      }
    },
    /**
     * 更新某一字段值 自增
     */
    async OpProjectRecordAmount(params) {

      let Newparams = {
        projectId: params.projectId,
        itemId: params.itemId,
        field: 'play_count',
      }
      
      try {
        let { status, info, data } = await this.$api.OpProjectRecordAmount(Newparams);
      } catch (error) {
        let { status, info, data } = error;

        if (status == 1) {
          
        } else {
          console.log(info, "131");
        }
      }
    },
    /**
     * 播放
     */
    playVideo() {
      // let { logged } = this;

      // if (logged) {
      //   this.RouterGO('/logged', { ssResourceId: this.ssResourceId, urlType: this.urlType, login: true })
      // } else {
      //   this.btnclick();
      //   // this.loginVisible = true;
      //   // this.AjaxAccessTicket({ client: 1 });
      // }
    },
    /**
     * 分享
     */
    getShareInfo(res) {
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
    },
  }
};
</script>

<style lang="scss" scoped>
@import url(../../assets/scss/common.scss);
.resourse {
  width: 100%;
  height: 100%;
  
  .footer_btn {
    height: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>
<style lang='scss'>
.iphonex_page_footer {
  height: 80px!important;
}

.page-content-padding {
    padding-bottom: 20px;
}

.iphonex_footer_btn {
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start!important;
  padding-top: 10px!important;
}
</style>
