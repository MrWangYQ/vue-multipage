<template>
  <div
    class="ailogin"
    @click.stop.prevent="SaleTeachHidden"
    v-if="loginVisible"
  >
    <!-- 消息框 -->
    <Tips :tipvisible.sync="tipvisible">{{ errorText }}</Tips>
    <div v-if="guideSaleVisible" @click="SaleTeachHidden" class="signupok">
      <p>添加老师</p>
      <div v-if="classObj.appliedClassBeginTime">
        开课时间： {{ classObj.appliedClassBeginTime }}
      </div>
      <img :src="teacherPosterUrl" alt="" />
    </div>
    <div class="ailogin-form" @click.stop="">
      <div class="ailogin-input">
        <p>
          <input
            v-model.number.trim="loginList.account"
            @change="accountChange"
            placeholder="请输入手机号(仅用于上课)"
          />
        </p>
        <p class="verific-code">
          <input
            v-model.trim="loginList.code"
            maxlength="6"
            placeholder="短信验证码"
          />
          <button v-if="CaptchaShow" @click="clickCaptcha">获取验证码</button>
          <button v-else class="uncaptcha" disabled>
            ({{ CaptchaCount }}s)
          </button>
        </p>
      </div>
      <div class="ailogin-list">
        <p class="list-title">{{ classObj.title }}</p>
        <p class="list-des" v-if="classObj.description">
          {{ classObj.description }}开课
        </p>
      </div>

      <div class="confirm-btn">
        <button
          @click="clickConfirm"
          :disabled="isConfirm"
          :class="true ? '' : 'uncaptcha'"
        >
          立即领取
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Tips from "@/components/Tips/index";
import Api from "@/api/apijson";

var BrowseEvent;
var CountEvent;
import { buriedPointFun } from "../../utils/mta.js";

export default {
  name: "ailogin",
  props: {
    loginVisible: {
      type: Boolean,
      default: false,
    },
    paramsObj: {
      type: Object,
      default: {},
    },
    classObj: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    phoneREG: /^((\+?86)|(\(\+86\)))?1(3|4|5|6|7|8|9)\d{9}$/,
    loginList: {
      type: "phoneCode",
      account: "",
      code: "",
    },

    laveCount: 10,
    objectNumber: 0,
    activityNumber: 0,
    CaptchaCount: 0,
    CaptchaShow: true,
    CaptchaTimer: null,
    isConfirm: false,
    errorText: "",
    tipvisible: false,
    teacherPosterUrl: "",
    guideSaleVisible: false,
    deviceId: "",
    CEvent: "",
    channel: "saleH5",
  }),
  components: {
    Tips,
  },
  watch: {
    guideSaleVisible(value) {
      if (value) {
        try {
          
          buriedPointFun("event_click17", "添加老师页面pv", "CountEvent");

          this.CEvent = new CountEvent("event_click17", "添加老师页面pv");

          window.JAnalyticsInterface.onEvent(this.CEvent);
        } catch (error) {
          console.log(error ,17);
        }
        
      }
    },
  },
  mounted() {
    let {
      objnum = 0,
      count = 10,
      actnum = 0,
      channel = "saleH5",
    } = this.paramsObj;
    let id = localStorage.getItem("murmur");

    document.title = "51Talk AI启蒙";

    if (id) {
      this.deviceId = id;
    }

    if (objnum || count || actnum || channel) {
      this.laveCount = count;
      this.objectNumber = objnum;
      this.activityNumber = actnum;
      this.channel = channel;
    }
    // console.log(
    //   this.paramsObj,
    //   "this.activityNumber",
    //   this.activityNumber,
    //   "objectNumber",
    //   this.objectNumber
    // );
    try {
      BrowseEvent = window.JAnalyticsInterface.Event.BrowseEvent;

      window.JAnalyticsInterface.onEvent(this.CEvent);
      CountEvent = window.JAnalyticsInterface.Event.CountEvent;
    } catch (error) {
      console.log(error, "140 - click 17");
    }
  },
  methods: {
    clickConfirm() {
      let { phoneREG, loginList } = this;
      let { account, code, type } = loginList;
      if (account && code && phoneREG.test(account) && type) {
        try {
          let CEvent = new CountEvent("event_click16", "点击“立即领取”人数");

          window.JAnalyticsInterface.onEvent(CEvent);

          buriedPointFun("event_click16", "点击“立即领取”人数", "CountEvent");
        } catch (error) {
          console.log(error, "140 - click 16");
        }
        
        this.isConfirm = true;
        console.log("提交");
        this.AuthLogin(loginList);
      } else {
        console.log("提交错误: ", account, code);
        this.errorText = "手机号/或验证码不正确";
        this.tipvisible = true;
      }

      // this.$emit('update:loginVisible', false);
      // this.$emit("loginCallBack", {activityNumber: this.activityNumber, url: '----'});

      
    },
    /**
     * 隐藏老师页面
     */
    SaleTeachHidden() {
      this.SaleTeachVisible = false;
      this.$emit("update:loginVisible", false);
      this.$emit("loginCallBack", {
        activityNumber: this.activityNumber,
        hiddenPage: "hidden",
      });
    },
    accountChange() {
      try {
        let CEvent = new CountEvent("event_view14", "填写手机号pv");
        window.JAnalyticsInterface.onEvent(CEvent);

        buriedPointFun("event_view14", "填写手机号pv", "CountEvent");
      } catch (error) {
        console.log(error, "140 - click 14");
      }
    },
    /**
     * 获取验证码
     */
    clickCaptcha() {
      let {
        phoneREG,
        loginList: { account },
      } = this;

      if (phoneREG.test(account)) {
        // this.getCode();
        try {
          let CEvent = new CountEvent("event_click15", "点击获取验证码人数");

          window.JAnalyticsInterface.onEvent(CEvent);

          buriedPointFun("event_click15", "点击获取验证码人数", "CountEvent");
        } catch (error) {
          console.log(error, "140 - click 15");
        }
        this.GetAuthSmsCode({ mobile: account });
      } else {
        this.errorText = "手机号不正确";
        this.tipvisible = true;
        console.log("手机号不正确");
      }
    },
    /**
     * 获取 验证码 倒计时
     */
    getCode() {
      // 设置总值
      const TIME_COUNT = 60;
      // 非 null
      if (!this.CaptchaTimer) {
        this.CaptchaCount = TIME_COUNT;
        this.CaptchaShow = false;
        this.CaptchaTimer = setInterval(() => {
          // 时间大于 0 小于 60 秒
          if (this.CaptchaCount > 0 && this.CaptchaCount <= TIME_COUNT) {
            this.CaptchaCount--;
          } else {
            this.CaptchaShow = true;
            clearInterval(this.CaptchaTimer);
            this.CaptchaTimer = null;
          }
        }, 1000);
      }
    },
    /**
     * 登录
     */
    async AuthLogin(params) {
      try {
        let {
          data: { code, data, msg },
        } = await this.$http.post(Api.AuthLogin, params);

        if (code == 0) {
          let Time = new Date().getTime();

          if (data && data.expiresIn) {
            Time += Number(data.expiresIn);
          }

          if (data && data.token) {
            localStorage.setItem(
              "token",
              data.token + "&" + new Date().getTime() + "&" + Time
            );
            localStorage.setItem("refresh", data.refreshToken);

            this.ConfimSaleActivityFreeApply(data.token);
          }
        } else {
          this.errorText = msg || "登录错误";
          this.tipvisible = true;
          this.isConfirm = false;
          console.log(msg, "131");
        }
      } catch (error) {
        this.isConfirm = false;
      }
    },
    /**
     * 报名
     */
    async ConfimSaleActivityFreeApply(token) {
      let { activityNumber, objectNumber, channel } = this;

      let NewMsg = "";
      let teacherPosterUrl = "";
      let pathName = "/sale";
      let queryObj = {
        activityNumber: activityNumber,
        url: teacherPosterUrl,
        channel,
      };
      console.log(activityNumber, objectNumber, "138");

      this.isConfirm = true;

      try {
        let {
          data: { code, data = {}, msg },
        } = await this.$http.post(
          Api.saleActivityFreeApply,
          { activityNumber: activityNumber, objectNumber: objectNumber },
          { headers: { token: token } }
        );

        if (code == 0) {
          this.teacherPosterUrl = data.teacherPosterUrl;
          this.guideSaleVisible = true;
          
          let timer = null;

          timer = setTimeout(() => {
            try {
              buriedPointFun("Event_click_13", "立即领取实际报名", "CountEvent");

              let CEvent = new CountEvent("Event_click_13", "立即领取实际报名");
              console.log(CEvent, "Event_click_13");
              window.JAnalyticsInterface.onEvent(CEvent);
            } catch (error) {
              console.log(error, "140 - click 15");
            }
            clearTimeout(timer);
          }, 100)
          
        } else if (code == 40005) {
          NewMsg = msg;
        } else {
          NewMsg = msg;
          // 30002 - 班级未上架
          // 30003 - 班级不在报名期
          // 30202 - 班级名额已满
          console.log(msg, "131", code);
        }

        if (NewMsg) {
          this.errorText = NewMsg;
          this.tipvisible = true;
        }

        this.$emit("loginCallBack", queryObj);

        let timer = setTimeout(() => {
          if (!this.teacherPosterUrl) {
            // this.$router.push({ path: pathName, query: queryObj });

            this.$emit("update:loginVisible", false);
          }

          clearTimeout(timer);
          timer = null;
        }, 1500);
        this.isConfirm = true;
      } catch (error) {
        this.isConfirm = false;
      }
    },
    /**
     * 获取token
     */
    async GetAuthSmsCode(params) {
      let { deviceId } = this;
      try {
        let {
          data: { code, data, msg },
        } = await this.$http.get(Api.AuthSmsCode, {
          params,
          headers: { deviceId: deviceId },
        });

        if (code == 0) {
          this.getCode();
        } else {
          console.log(msg, "131");
        }
        if (msg) {
          this.errorText = msg;
          this.tipvisible = true;
        }
      } catch (error) {
        console.log(error, "123");
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.ailogin {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 9;
  background-color: rgba($color: #000000, $alpha: 0.3);
  display: flex;
  align-items: flex-end;
  &-tips {
    height: 40px;
    line-height: 40px;
    background: rgba(248, 248, 250, 1);
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    .tips-left {
      color: #fff;
      font-size: 12px;
      color: rgba(178, 178, 178, 1);
    }
    .tips-right {
      font-size: 13px;
      color: rgba(51, 51, 51, 1);
      a {
        color: red;
      }
    }
  }
  &-list {
    margin: 0 0 5vw 0;
    .list-des {
      color: #fb841b;
    }
    .list-title {
      font-size: 18px;
    }
  }
  &-form {
    width: 100%;
    height: 90vw;
    background-color: #fff;
    border-radius: 40px 40px 0 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    box-sizing: border-box;
    .ailogin-title {
      width: 100%;
      height: 20vw;
      line-height: 20vw;
      font-size: 20px;
      text-align: center;
      border-radius: 40px 40px 0 0;
      background: #ffda36;
    }

    .ailogin-input {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 15vw;
    }

    p {
      width: 80%;
      margin: 2vw auto;
      input {
        width: 100%;
        height: 40px;
        background: rgba(245, 245, 248, 1);
        border-radius: 20px;
        padding: 0 20px;
        box-sizing: border-box;
        &::placeholder {
          color: #b7b7bd;
          font-size: 12px;
        }
      }
    }
    .verific-code {
      display: flex;
      input {
        flex: 1;
      }
      button {
        min-width: 80px;
        height: 40px;
        border-radius: 20px;
        margin-left: 10px;
        padding: 10px;
        box-sizing: border-box;
        background: rgba(255, 208, 51, 1);
        box-shadow: 0px 2px 0px 0px rgba(245, 197, 39, 1);
      }
    }
    .confirm-btn {
      width: 80%;
      margin: 0 auto;
      button {
        width: 100%;
        height: 35px;
        color: #fff;
        font-size: 18px;
        line-height: 35px;
        background: rgba(255, 136, 16, 1);
        box-shadow: 0px 3px 0px 0px rgba(225, 116, 12, 1);
        border-radius: 29px;
      }
    }
    button.uncaptcha {
      color: #333333;
      background-color: #ededed;
      box-shadow: none;
    }
  }

  .signupok {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: url(https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453137180625408.png);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    p {
      font-size: 30px;
      color: #3fa8f0;
      margin: 10px 0;
    }
    div {
      width: 70%;
      font-size: 13px;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
      background: linear-gradient(
        270deg,
        #ffe14d 0%,
        #ffffff 44%,
        #ffe24f 100%
      );
      opacity: 0.69;
    }
    img {
      width: 85%;
    }
  }
}
</style>
