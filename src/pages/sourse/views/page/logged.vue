<template>
  <div class="logged">
    <Guide :guideVisible.sync='guideVisible'></Guide>
    <Page
      :isFooter='(resourceType == 1 || urlType == 2)'
      :style="resourceType == 1 ?  'background:linear-gradient(0deg,rgba(151,233,111,1),rgba(106,191,64,1));' : resourceType == 4 ? 'background-image:url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453063790283264.png)':''">
      <div class="course_review" v-if="course_review">

        <div v-show="resourceType != 4" @click="selfClass">
          <img src="https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453126575999488.jpg" alt="">
        </div>

      </div>
      <div v-if="resourceType != 1">
        <img :src="pageList.answer_img">
      </div>
      <!-- <div v-if="resourceType == 1 && !logged">
        <img :src="pageList.img" alt="">
      </div> -->
      
      <div v-show="resourceType == 1" class="audio-wrapper">
        <div class="audio-img">
          <img :src="pageList.img" alt="">
        </div>
        <div class="audio-tip">
          <div>
            <a v-if="nextName">【{{ nextName }}】</a>
            <a class="mp3-no">{{ pageList.no }}</a>
            <svg
              v-if="pageList.no"
              t="1589452877655"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="10485"
              width="16"
              height="16">
              <path
                d="M895.003035 1024H703.233576c-35.303452 0-63.922015-28.62027-63.922016-63.923722V640.462788c0-35.305159 28.62027-63.923722 63.922016-63.923722H895.003035v-50.49933c2.617978-195.906343-139.415016-363.837524-333.041294-393.766783C351.984192 104.383124 159.154913 251.995108 131.265083 461.972656a383.617424 383.617424 0 0 0-3.339885 50.640982v63.923722h191.769459c35.305159 0 63.923722 28.62027 63.923722 63.923722v319.613489c0 35.305159-28.62027 63.923722-63.923722 63.923722H127.925198c-70.608611 0-127.845737-57.238833-127.845737-127.845737V530.514533C-4.361203 256.567183 203.413079 25.645809 476.305728 1.230689c281.762031-19.418093 525.916653 193.254232 545.334747 475.014556 0.832838 12.105162 1.23731 24.235924 1.208297 36.368393v383.538918c0 70.608611-57.238833 127.847444-127.845737 127.847444z"
                p-id="10486"
                fill="#2D6A18"
              ></path>
            </svg>
            <span>{{ pageList.play_count }}</span>
          </div>
          <p>{{ pageList.word }}</p>
        </div>
        
        <div class="circleProgress_wrapper">
          <div id="slice_wrapper" class="slice">
            <div class="bar pre50"></div>
            <div class="fill"></div>
          </div>
        </div>
        <div class="audio-length-current">
          <span id="audio_length_current">00:00</span>
        </div>
      </div>
      <div v-show="resourceType == 4" class="video-page">
        <div class="video-controls">
          <div class="video-content">
            <video
              id="video"
              controls
              name="media"
              preload="none"
              x-webkit-airplay="allow"
              x5-playsinline=""
              webkit-playsinline=""
              playsinline="true"
              :poster='pageList.video_img'
              :src="pageList.video_url">
              <!-- <source :src="pageList.video_url" type="video/mp4"> -->
            </video>
            <div class="video-title">
              <span v-if="pageList.code || pageList.video_name">{{ pageList.code }}  {{ pageList.video_name }}</span>
              <p v-if="pageList.play_count"><i></i> {{ pageList.play_count }} 人已观看</p>
            </div>
          </div>
          <div class="video-dashed"></div>
          <div class="video-play">
            <div class="video-desc">
              <span v-if="pageList.video_name"><i></i>【{{ pageList.video_name }}】</span>
              <p v-if="pageList.video_desc">{{ pageList.video_desc }}</p>
            </div>
          </div>
        </div>
        <div class="logo"></div>
      </div>
      <div
        v-show="([1,4].indexOf(resourceType) > -1 || urlType == 2)"
        slot="btn"
        id="footer_btn"
        :class="([1,4].indexOf(resourceType) > -1 || urlType == 2) ? 'footer_btn':''">
        <button @click="btnclick">
          <i class="iconfont icon-fenxiang"></i>
          <span>{{nextName}}</span>
        </button>
      </div>
    </Page>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import "@/utils/audioPlayPlugin";
import { transTime } from "@/common";
import Page from "@/components/page/index";
import Guide from "@/components/guide/index";
import Api from "../../services/apilist";
import isIphoneX from '@/utils/isIphoneX';

export default {
  name: "logged",
  components: {
    Page,
    Guide
  },
  data: () => ({
    nextName: "",
    loginVisible: false,
    timeoutShow: null,                    // 调用音频
    interValMp3: null,                    // 音频
    ssResourceId: "",             
    pageList: '',
    user_id: "", // 是否正常登录
    course_review: "", // 课程回顾 url
    guideVisible: false,    // 是否展示指引页面
    resourceType: '', // 区分类型
    urlType: '',                    // 对应展示内容
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

    watchId: new Date().getTime(),              // 时间戳
  }),
  created() {
    try {
      // 获取参数
      this.ssResourceId = this.getQueryUrl("ssResourceId");
      this.urlType = this.getQueryUrl("urlType") || 1;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    try {
      let timer = null;
      let _this = this;
      // 获取设置
      this.$nextTick(() => {
        this.resourceQueryResource({ number: this.ssResourceId });

        // 提前预制分享
        this.share();

        timer = setTimeout(() => {
          // 获取最新记录信息
          _this.saveConfValueByField();        
          _this.OpProjectRecordAmount(_this.saveConfValue);
          _this.getOpProjectInfo(_this.saveConfValue);
          timer = null;
        }, 500);

        

        /* 函数使用 */
        if(isIphoneX()){
          let pageFooter = document.getElementById('page-footer');
          let footer_btn = document.getElementById('footer_btn');

          pageFooter.className = 'page-footer iphonex_page_footer';
          footer_btn.className = 'footer_btn iphonex_footer_btn';
        }
      })
        // 统计
      this.resourceLog({ number: this.ssResourceId, event: 0 });
    } catch (error) {
      // alert(JSON.stringify(error)+'186');
    }
  },
  methods: {
    /**
     * 点击按钮
     */
    btnclick() {
      this.guideVisible = true;
      this.resourceLog({ number: this.ssResourceId, event: 4 })
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
    share() {
      try {
        // let { code, data, message } = await this.$api.resourceShare({ number: this.ssResourceId, shareUrl: window.location.href });
        this.$http.post(
          { api: Api.resourceShare, type: 'fromdata' },
          { number: this.ssResourceId, shareUrl: window.location.href },
          function success(res) {
            console.log(res);
            let { code, data } = res;

            if (code == 200) {
              this.getShareInfo(data);
            }
          },
          function fail(error) {
            console.log(error);
          }
        )
      } catch (error) {
      }
    },
    /**
     * 获取资源配置
     */
    resourceQueryResource(params = {}) {
      try {
        // let { code, data, msg } = await this.$api.resourceQueryResource(params);
        
        this.$http.post(
          { api: Api.resourceQueryResource, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
            let { code, data, msg } = res;

            if (code == 200) {
              _this.catchStatus(data);
            } else {
              console.log(msg);
            }
          },
          function fail(error) {
            console.log(error);
          },
        )
      } catch (error) {
        console.log(error+'239');
      }
    },

    /**
     * 检验是否 登录
     */
    getProjectBaseInfo(params) {
      try {
        // let data = await this.$api.getProjectBaseInfo(params);
        this.$http.get(
          { api: Api.getProjectBaseInfo, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
          },
          function fail(error) {
            console.log(error);
            let { status, info, data } = error;

            if (status == 1) {
              if (data.user_id) {

                _this.saveConfValue.val = data.user_id;
                _this.logged = true;
              } else {
                _this.loginVisible = true;
                // 获取最新的 at
                _this.AjaxAccessTicket({ client: 1 });
                console.log(info);
              }
              _this.loginList.user_id = data.user_id;
            }
          }
        )
      } catch (error) {
        let { status, info, data } = error;

        if (status == 1) {
          if (data.user_id) {

            this.saveConfValue.val = data.user_id;

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
    AjaxAccessTicket(params) {
      // alert(JSON.stringify(params)+'--275');
      try {
        // let {
        //   data: { code, res, message }
        // } = await this.$http.get(Api.AjaxAccessTicket, params);

        // let { code, res, message } = await this.$api.AjaxAccessTicket(params);

        this.$http.get(
          { api: Api.AjaxAccessTicket, type: 'fromdata' },
          params,
          function success(data) {
            let { code, res, message } = data;

            console.log(res);
          },
          function fail(error) {
            console.log(error);
            let { code, res, message } = error;

            if (code == 10000) {
              if (res && res.at) {
                _this.loginList.at = res.at;
              }
            } else {
              console.log(message, "131");
            }
          }
        )

        // alert(this.loginList.at+'---278--'+res.at);
      } catch (error) {
        // alert('287'+JSON.stringify(error));
      }
    },
    /** 进入到 答案页面 调用 */
    saveConfValueByField() {
      let params = this.saveConfValue;

      try {
        // let { data, status, info } = await this.$api.saveConfValueByField(params);
        this.$http.post(
          { api: Api.saveConfValueByField, type: 'fromdata' },
          params,
          function success(res) {
            let { data, status, info } = res;

            if (status == 1) {

            }

            console.log(res);
          },
          function fail(error) {
            console.log(error);
            let { data, status, info } = error;

            if (status == 1) {

            }
          },
        )
      } catch (error) {
        console.log(error);
      }
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
      let _this = this;

      switch (Number(status)) {
        case 0:
          this.pageList = resourceContent;
          // resourceType = 1;
          Object.assign(this.juniorList, { projectId, v, t });
          Object.assign(this.saveConfValue, { projectId, itemId, v, t });

          this.getProjectBaseInfo(this.juniorList);

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

            this.$nextTick(() => {
              _this.timeoutShow = setTimeout(() => {
                _this.handleAudio();
              }, 1000);
            });
          } else if (resourceType == 4) {
            documentTitle = "家长大讲堂";
            nextName = "邀好友一起学习";
            console.log('396');
            this.$nextTick(() => {
              console.log('398');
              _this.handleVideo();
            })
          }

          // this.btnName = newName;
          this.nextName = nextName;
          this.course_review = previousReviewUrl;
          this.resourceType = resourceType;

          document.title = documentTitle;
          break;
        case 1:
          this.loginVisible = true;
          break;
        case 2:
          window.location.href = shortUrl;
          break;
        case 3:
        case 4:
          // this.RouterGO('/error');
          break;
        default:
          // this.RouterGO('/error');
          break;
      }

      this.urlType = urlType;
      
    },
    /**
     * 路由跳转
     */
    RouterGO(toPath) {
      try {
        let origin = window.location.origin;

        if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
          window.location.href = origin + "/#" + toPath;
        } else {
          this.$router.push({ path: toPath });
        }  
      } catch (error) {
        // alert(JSON.stringify(error.message)+'419');
      }
    },
    /**
     * 获取绑定之后的分享数据
     */
    getSharePage(list) {
      // console.log(list, "255");
      // 是否登录
      this.logged = true;
    },
    /**
     * 获取日志
     */
    resourceLog(params) {

      try {
        // let { code, data, message } = await this.$api.ResourceLog(params);
        
        this.$http.post(
          { api: Api.ResourceLog, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
            let { code, data, message } = res;

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
            // alert('取消分享502')
          },
          fail: function(e) {
            // alert('取消503'+JSON.stringify(e));
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
          },
          cancel: function() {
            console.log("取消分享");
          }
        });
      });
    },
    /**
     * 获取某一记录内容
     */
    getOpProjectInfo(params) {
      let Newparams = {
        projectId: params.projectId,
        itemId: params.itemId,
        v: params.v,
        t: params.t
      }

      try {
        // let { status, info, data } = await this.$api.getOpProjectInfo(Newparams);
        this.$http.post(
          { api: Api.getOpProjectInfo, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
            let { status, info, data } = res;

            if (status == 1) {
              if (data) {
                _this.pageList.play_count = data.play_count || 0;
              }
            } else {
              console.log(info, "131");
            }
          },
          function fail(error) {
            console.log(error);

            let { status, info, data } = error;

            if (status == 1) {
              if (data) {
                _this.pageList.play_count = data.play_count || 0;
              }
            } else {
              console.log(info, "131");
            }
          },
        )
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
    OpProjectRecordAmount(params) {

      let Newparams = {
        projectId: params.projectId,
        itemId: params.itemId,
        field: 'play_count',
      }
      
      try {
        // let { status, info, data } = await this.$api.OpProjectRecordAmount(Newparams);
        this.$http.post(
          { api: Api.OpProjectRecordAmount, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
          },
          function fail(error) {
            console.log(error);
          },
        )      
      } catch (error) {
        let { status, info, data } = error;

        if (status == 1) {
          
        } else {
          console.log(info, "131");
        }
      }
    },
    /**
     * 处理视频
     */
    handleVideo() {
      let video = document.querySelector('#video');
      let _this = this;
      let InterTime;
      let currentTime = 0;

      // 播放监听
      video.addEventListener('play', function (e) {
        console.log('提示该视频正在播放中')
        InterTime = setInterval(function () {
          postConfirm();
        }, 250)
      })

      // 暂停播放
      video.addEventListener('pause', function (e) {
        console.log('暂停播放', video.currentTime)
        // console.log(e)
        window.clearInterval(InterTime);
        // _this.handleRangeTime();   //向后台发数据
      })


      // 视频播放完毕
      video.addEventListener('ended', function (e) {
        console.log('视频播放完了')
        // console.log(e)
        window.clearInterval(InterTime);
        _this.currentTime = 0;
        // _this.handleRangeTime();   //向后台发数据
      })

      function postConfirm() {
        currentTime += 0.25;
        _this.currentTime = currentTime;
        if (currentTime%10 == 0) {
          _this.handleRangeTime();
        }
      }
      //直接关闭页面，并向后台发送数据
      if(window.addEventListener){
          window.addEventListener("beforeunload",_this.handleRangeTime,false);
      }else{
          window.attachEvent("onbeforeunload",_this.handleRangeTime);
      }

    },
    /**
     * 10 s 处理数据
     */
    handleRangeTime() {
      console.log('进来了');
      let { ssResourceId, watchId } = this;

      let params = {
        number: ssResourceId,
        watchId: watchId,
      };

      try {
        // let { data, code, message } = await this.$api.watchTime(params);
        this.$http.post(
          { api: Api.watchTime, type: 'fromdata' },
          params,
          function success(res) {
            console.log(res);
          },
          function fail(error) {
            console.log(error);
          },
        )
        if (code == 200) {
          // console.log(data, message, '635');
        } else {
          console.log(message);
        }
      } catch (error) {
        console.log(error);
        // alert(JSON.stringify(error));
      }
    },
    /**
     * 处理音频 
     * 
     */
    handleAudio() {
      try {
        let bar = document.querySelector(".slice>.bar");
        let process = 0;
        let circleProgress = document.querySelector(".circleProgress_wrapper");
        let slice = document.getElementById("slice_wrapper");
        let audio_length_current = document.getElementById('audio_length_current');
        let _this = this;

        console.log(audioController);
        
        let audio = new audioController({
          src: this.pageList.mp3,
          events:{
            "play":function(){
              addClass(circleProgress,"rotate");
            },
            "timeupdate":function(){
              process = audio.getAttr("currentTime") / audio.getAttr("duration") * 360;
              parseInt(process) > 170 && addClass(slice,"gt50");
              bar.style = "transform:rotate("+parseInt(process)+"deg)";
            },
            "pause":function(){
              removeClass(circleProgress,"rotate");
            },
            "ended":function(){
              removeClass(circleProgress,"rotate");
              removeClass(slice,"gt50");
              bar.style="transform:rotate(0deg)";
            }
          }
        });

        // 监听音频加载完毕显示总时长
        audio.audio.addEventListener('canplay', function() {
          console.log(audio.audio.duration);
          audio_length_current.innerHTML = transTime(audio.audio.duration);
        })
        // 监听点击事件
        circleProgress.addEventListener("click",function(){
          if(audio.getAttr("paused")){
            audio.play();

            audio_length_current.innerHTML = transTime(audio.getAttr("currentTime"));
            
            _this.interValMp3 = setInterval(() => {
              if (audio.getAttr("currentTime") / audio.getAttr("duration") == 1) {
                audio_length_current.innerHTML = transTime(audio.getAttr('duration'));
                clearInterval(_this.interValMp3)
                _this.interValMp3 = null;
                return;
              } else {
                audio_length_current.innerHTML = transTime(
                  audio.getAttr("currentTime")
                );
              }
            }, 1000);
          }else{
            audio.pause();
            // audio_length_current.innerHTML = transTime(audio.getAttr("currentTime"));
          }
        });
        function addClass(element,className){
          var oldClass = element.className;
          oldClass.indexOf(className) < 0 && (element.className = oldClass +" "+ className);
        }
        function removeClass(element,className){
          element.className = element.className.replace(new RegExp("\\s"+className),"");
        }
        clearTimeout(this.timeoutShow);
      } catch (error) {
      }
    },
  },
  beforeDestroy() {
    if (document.getElementById('audio_length_current')) {
      document.getElementById('audio_length_current').innerHTML = '00:00';
    }
  }
};
</script>

<style lang="scss" scoped>
@import url(../../assets/scss/common.scss);
.logged {
  width: 100%;
  height: 100%;
  .audio-wrapper {
    // background-color: #fcfcfc;
    max-width: 670px;
    height: 70px;
    .audio-img {
      width: 259px;
      height: 342px;
      margin: 0 auto;
      margin-top: 15px;
      border-radius: 20px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .audio-tip {
      width: 280px;
      margin: 10px auto 0;
      &>div {
        text-align: center;
      }
      span {
        margin: 0 0 0 4px;
      }
      .mp3-no {
        margin: 0 4px 0 0;
      }
      a,
      span {
        color: rgba(45, 106, 24, 1);
        font-size: 13px;
      }
      p {
        color: rgba(30, 30, 30, 1);
        font-size: 30px;
        font-weight: 700;
        text-align: center;
        margin: 15px 0 16px 0;
      }
    }
    .audio-length-current {
      text-align: center;
      font-size: 20px;
      margin-top: 10px;
      color: rgba(45, 106, 24, 1);
    }
  }

  .course_review {
    position: absolute;
    right: 5px;
    top: 15px;
    &>div {
      width: 50px;
      height: 50px;
      cursor:pointer;
      img {
        width: 100%;
      }
    }
  }
  .circleProgress_wrapper {
    margin: auto;
    position: relative;
    width: 55px;
    height: 55px;
    overflow: hidden;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
  }
  .circleProgress_wrapper:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #fff;
    // background:rgba(0,0,0,0.1) url('https://fatty-shu.github.io/audioPlayPlugin/images/viweImg.png');
    background-size: cover;
    border-radius: 50%;
  }
  .circleProgress_wrapper.rotate:before {
    animation: audioLogoRotate 10s linear infinite;
  }
  @keyframes audioLogoRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .circleProgress_wrapper:after {
    position: absolute;
    top: 13px;
    left: 13px;
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    // background-color: rgba(0, 0, 0, 0.1);
    background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453131175963136.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 19px 21px;
  }
  .circleProgress_wrapper.rotate:after {
    left: 12px;
    top: 12px;
    background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453131479304704.png);
    background-size: 19px 21px;
  }
  .slice {
    position: absolute;
    width: 100%;
    height: 100%;
    clip: rect(0, 55px, 55px, 27.5px);
  }
  .slice.gt50 {
    clip: rect(auto, auto, auto, auto);
  }
  .bar,
  .fill {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px rgba(78, 188, 233, 1) solid;
    box-sizing: border-box;
    border-radius: 50%;
    clip: rect(0, 27.5px, 55px, 0);
  }
  .slice.gt50 .fill {
    transform: rotate(180deg);
  }


  .footer_btn {
    height: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
</style>
<style>
.iphonex_page_footer {
  height: 80px!important;
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
