<template>
  <div class="login" v-show="login">
    <div class="login-content">
      <p>●{{ formName ? '登录后即可预约':'登录后即可免费观看精彩内容' }}●</p>
      <div class="phone-number">
        <input
          type="text"
          v-model="phoneNumber"
          @change="phoneChange(phoneNumber)"
          placeholder="请输入您的手机号"
        >
      </div>
      <div class="captcha-row">
        <input type="text" v-model="mobile_code" @change="captchaChange(mobile_code)" placeholder="请输入验证码">
        <button v-if="show" class="captcha" @click="getCaptcha">获取验证码</button>
        <button v-else class="uncaptcha" disabled>{{ count }} s</button>
      </div>
      <div class="captcha-row" v-if="captchaFlag">
        <input type="text" v-model="captcha" @change="mobileCodeChange(captcha)" placeholder="请输入验证码">
        <img src="//login.51talk.com/ajax/captcha/" alt="">
      </div>
      <div>
        <button class="confirm-btn" @click='confirmlogin'>{{ formName ? '立即登录':'免费观看'}}</button>
      </div>
      <span class="del-btn" @click="closeBtn"></span>
    </div>
    <!-- 消息框 -->
    <Tips :tipvisible.sync='tipvisible'>{{ errorText }}</Tips>
  </div>
</template>

<script>
import Tips from '@/components/Tips/index';
import Api from '@/api/apijson';

export default {
  props: {
    login: {
      type: Boolean,
      default: false,
    },
    loginList: {
      type: Object,
      default: () => {
        return { at: "", mobile: "", sms_code: 1, client: 1, user_id: "" };
      }
    },
    juniorList: {
      type: Object,
      default: {},
    },
    formName: {
        type: String,
        default: '',
    }
  },
  name: "login",
  components: {
    Tips,
  },
  data: () => ({
    phoneNumber: "",
    mobile_code: '',
    captcha: "",
    captchaFlag: false,
    show: true,
    count: "",
    timer: null,
    tipvisible: false,
    againlogin: true,
    errorText: '手机号输入不正确',
    defaultLoginList: '',
  }),
  watch: {
    loginList (value) {
      this.defaultLoginList = value;
    }
  },
  created() {
    this.defaultLoginList = this.loginList;
  },
  methods: {
    /**
     * 手机号 change
     */
    phoneChange(value) {
      this.defaultLoginList.mobile = value;
    },
    /**
     * 验证码
     */
    captchaChange(value) {
      console.log(value, "37");
    },
    mobileCodeChange(value) {
    },
    /**
     * 关闭弹框
     */
    closeBtn() {
      this.phoneNumber = '';
      this.mobile_code = '';
      this.captcha = '';

      this.$emit('update:login', false);
    },
    /**
     * 获取 验证码
     */
    getCaptcha() {
      let { phoneNumber } = this;
      let phoneREG = /^((\+?86)|(\(\+86\)))?1(3|4|5|6|7|8)\d{9}$/;
      
      if (!phoneNumber && !phoneREG.test(phoneNumber)) {
        // this.$message.error('请输入正确的手机号!');
        this.errorText = '手机号输入不正确，请重新输入!';
        this.tipvisible = true;
        return;
      }
      
      this.defaultLoginList.mobile = phoneNumber;
      // alert('118---'+JSON.stringify(this.defaultLoginList));
      // 获取手机验证码
      this.AjaxMobileMessage(this.defaultLoginList);
    },
    /**
     * 获取 验证码 倒计时
     */
    getCode() {
      // 设置总值
      const TIME_COUNT = 60;
      // 非 null
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          // 时间大于 0 小于 60 秒
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    /**
     * 获取登录信息
     */
    async AjaxAccessTicket(params) {
      try {
        let {
          data: { code, res, message }
        } = await this.$http.get(Api.AjaxAccessTicket, params);

        if (code == 10000) {
          if (res && res.at) {
            console.log(this.defaultLoginList, '143');
            this.defaultLoginList.at = res.at;
            console.log('144', res.at);
          }
        } else {
          console.log(message, "131");
        }
        // alert(this.defaultLoginList.at+'---145--'+res.at);
      } catch (error) {
        // alert(error+'---157--');
      }
    },
    /**
     * 获取手机验证码
     */
    async AjaxMobileMessage(params) {
      
      try {
        this.$jsonp(Api.AjaxMobileMessage, params).then(data => {
          let { code, message, res } = data;
          let errorText = '';
          let captchaFlag = false;

          console.log(data, '138');
          if (code == 10000) {
            errorText = '验证码已发送!';
            this.getCode();
          
          } else if (code == 66205) {
            // this.AjaxCaptcha();
            captchaFlag = true;
          } else {
            errorText = message;
          }

          this.captchaFlag = captchaFlag;
          // 错误信息提示
          this.errorText = errorText;
          if (errorText) {
            // 提示框
            this.tipvisible = true;
          }
          this.AjaxAccessTicket({client: 1});
        }).catch(error => {
          console.log(error, '140');
        })
      } catch (error) {
        console.log(error, '95');
      }
    },
    /**
     * 登录
     */
    confirmlogin () {
      let { phoneNumber, mobile_code, defaultLoginList, captcha, againlogin } = this;

      if (!phoneNumber || !mobile_code) {
        this.errorText = '手机号或验证码输入不正确!';
        this.tipvisible = true;
        return;
      }
      
      // console.log(phoneNumber, mobile_code, defaultLoginList, '150');
      if (againlogin) {
        this.AjaxStudentSignin({ ...this.defaultLoginList, mobile_code, captcha, data_type: 'json' });
      }
    },
    /**
     * 提交登录
     */
    async AjaxStudentSignin(params) {
      
      this.againlogin = false;

      try {
        // let { data: { code, res, message } } = await this.$http.post(Api.AjaxStudentSignin, params);
        let { code, res, message } = await this.$api.AjaxStudentSignin(params);
      } catch (error) {
        console.log(error, '201');
        let ter = error;
        
        if (typeof ter === 'string') {
          let first = ter.indexOf('{(');
          let last = ter.indexOf(')}');

          ter = ter.substring(0, last);
          ter = JSON.parse(ter.substring(first + 2));
        }
        
        let { code, res, message } = ter;

        if (code == 10000) {
          // 登录成功 关闭弹框          
          this.closeBtn();
          // 重新绑定
          this.getProjectBaseInfo(this.juniorList);
        } else if (code == 66205) {
          this.captchaFlag = true;
        } else {
          // 错误信息提示
          this.errorText = message;
          // 提示框
          this.tipvisible = true;
        }
        this.AjaxAccessTicket({ client: 1 });
        
      } finally {
        this.againlogin = true;
      }
    },
    /**
     * 检验是否 登录
     */
    async getProjectBaseInfo(params) {
      try {
        let data = await this.$api.getProjectBaseInfo(params);
      } catch (error) {
        console.log(error, "95");
        let { status, info, data } = error;

        if (status == 1) {
          if (data.user_id) {
            this.defaultLoginList.user_id = data.user_id;
          }
        }
        this.resourceUserBind()
      }
    },
    /**
     * 绑定
     */
    async resourceUserBind() {
      try {
        let { code, data, message } = await this.$api.resourceUserBind({ mobile: this.defaultLoginList.mobile, userId: this.defaultLoginList.user_id })
        if (code == 200) {
          console.log(data, message, '222');
          this.$emit('sharePage', data.shareWebPage);
        } else {
          console.log(message);
        }
      } catch (error) {
        console.log(error, '227');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &-content {
    width: 92%;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px 10px;
    box-sizing: border-box;
    position: relative;
    p {
      color: #f79350;
      font-size: 18px;
      line-height: 50px;
      text-align: center;
    }
    div {
      margin: 15px 0;
    }
    .phone-number {
      input {
        width: 100%;
      }
    }
    input {
      border: 1px solid #ededed;
      height: 44px;
      padding: 0 15px;
      border-radius: 22px;
      font-size: 14px;
      box-sizing: border-box;
    }
    button {
      border-radius: 22px;
      font-size: 14px;
      color: #685753;
      background-color: #ffe83c;
      border: none;
      height: 44px;
      text-align: center;
    }
    .uncaptcha {
      background-color: #ededed;
    }

    .confirm-btn {
      width: 100%;
      background-color: rgba(250, 229, 77, 1);
      border-radius: 24px;
      text-align: center;
    }

    .captcha-row {
      display: flex;
      justify-content: space-between;
      input {
        width: 60%;
      }
      button {
        width: 38%;
      }
    }
  }
  .del-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #fff;
    border-radius: 100%;
    position: absolute;
    bottom: -50px;
    left: 50%;
    margin-left: -15px;
    display: inline-block;
    box-sizing: border-box;
  }
  .del-btn:after {
    width: 1px;
    height: 28px;
    background: #fff;
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    transform: translateX(14px) rotate(140deg);
  }
  .del-btn:before {
    width: 1px;
    height: 28px;
    background: #fff;
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    transform: translateX(14px) rotate(40deg);
  }
}
</style>
