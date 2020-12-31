<template>
  <div class="form-address" :style="mpFormList.bgColor ? 'background-color:#' + mpFormList.bgColor:'background-color:#ccc;'">
    <div class="form-address_content">
      <div class="form-address_list list-image" v-if="mpFormList.formUrl">
        <!-- <img src="../../../static/image/No.png" alt="" srcset=""> -->
        <img :src="mpFormList.formUrl">
      </div>
      <p>姓名</p>
      <div class="form-address_list list-name">
        <input class="form-input" type="text" v-model="formList.name">
      </div>
      <p>手机号</p>
      <div class="form-address_list list-phoneNum">
        <input class="form-input" type="text" v-model="formList.phoneNum">
      </div>
      <p>地址</p>
      <div class="form-address_list list-address">
        <input class="form-input" type="text" @focus="focusAddress" placeholder="点击选择省市" v-model="formList.address">
      </div>
      <div class="form-address_list list-address">
        <textarea class="form-textarea" name="" id="" cols="10" rows="5" v-model="formList.addressDetail" placeholder="详细地址"></textarea>
      </div>
      <p>备注</p>
      <div class="form-address_list list-name">
        <textarea class="form-textarea" name="" id="" cols="10" rows="3" v-model="formList.memo" placeholder="备注"></textarea>
      </div>
      
      <div class="list-post">
        <button class="" @touchend.stop.prevent="confirmAddress(formList)">提交</button>
      </div>
    </div>

    <!-- 消息框 -->
    <Tips :tipvisible.sync='tipvisible'>{{ errorText }}</Tips>
  </div>
</template>

<script>
import cityData from '@/utils/city.js'
import Api from '../../services/apilist';
import Picker from '../../utils/picker.min.js'
import getQueryUrl from '@/utils/getHashParameters.js'
import Tips from '@/components/Tips/index';

export default {
  name: 'formaddress',
  data:() => ({
    title: 'formaddress',
    tipvisible: false,                        // 弹框文字提示开关
    errorText: false,                        // 弹框文字
    mpFormId: '',             // id
    mpActId: '',  
    mpFormList: {},             // mpformlist
    formList: {
      formId: '',
      mpActId: '',
      name: '',
      phoneNum: '',
      address: '',
      addressDetail: '',
      memo: '',
    }
  }),
  components: {
    Tips,
  },
  created() {
    try {
      this.mpFormId = getQueryUrl('mpFormId');
    } catch (error) {
      
    }
  },
  mounted() {
    
    this.formList.formId = this.mpFormId;

    this.getFormSettingByMpActId(this.mpFormId);
  },
  methods: {
    /**
     * 提交表单数据
     */
    async saveMpActivityRecord(params) {
      try {
        let { code, result, message } = await this.$api.saveMpActivityRecord(params);
        
        if (code == 200) {
          this.errorText = '保存成功';
          this.tipvisible = true;
          this.formList = this.$options.data().formList;

          this.formList.mpActId = this.mpActId;
          this.formList.formId = this.mpFormId;
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 提交地址
     */
    confirmAddress(form) {
      let { mpFormId, formList: { name, phoneNum, address, addressDetail, memo } } = this;
      let text = '';
      let reg = /^((\+?86)|(\(\+86\)))?1(3|4|5|6|7|8)\d{9}$/;
      console.log(name, phoneNum, address, addressDetail, memo);
      
      if (!name || !phoneNum || !address || !addressDetail || !memo) {
        if (!name) {
          text = '请填写正确的姓名!'
        } else if (!phoneNum) {
          text = '请填写正确的手机号!'
        } else if (!address) {
          text = '请填写正确的省市!'
        } else if (!addressDetail) {
          text = '请填写正确的详细地址!'
        } else if (!memo) {
          text = '请填写正确的备注!'
        }

        console.log(reg.test(phoneNum), phoneNum && !reg.test(phoneNum), text);
        
        this.errorText = text;
        this.tipvisible = true;
        return;
      }

      if (phoneNum && !reg.test(phoneNum)) {
        this.errorText = '请填写正确的手机号!'
        this.tipvisible = true;
        return;
      }
      
      console.log('提交了');
      
      this.saveMpActivityRecord(this.formList);
    },
    /**
     * 获取配置
     */
    getFormSettingByMpActId(params) {
      try {
        this.$http.get(
          { api: Api.getFormSettingByMpActId, type: 'fromdata' },
          { mpActId: params },
          function success(res) {
            let { code, data, message } = res;
            
            if (data) {
              this.mpActId = data; 
              this.formList.mpActId = data;
              // document.title = data.title;
            }        
            this.formList.mpActId = data;
          },
          function fail(error) {
            console.log(error);
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取地址
     */
    focusAddress() {
      let _this = this;

      new Picker({
        "title": '请选择',//标题(可选)
        "defaultValue": _this.formList.address,//默认值-多个以空格分开（可选）
        "data": cityData,//数据(必传)
        "keys": {
          "id": "Code",
          "value": "Name",
          "childData": "level"//最多3级联动
        },//数组内的键名称(必传，id、text、data)
        "callBack": function (val) {
          //回调函数（val为选择的值）
          _this.formList.address = val;
        }
      });
    },
  }
}
</script>

<style scoped lang='scss'>
@import url(../../assets/style/picker.css);
.form-address{
  font-size: 14px;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  &_list {
    margin: 10px auto;
    border-radius: 3px;
    // background-color: #fff;
  }
  .list-image {
    width: 100%;
    padding: 2px;
    box-sizing: border-box;
    img {
      width: 100%;
    }
  }
  .list-post {
    text-align: center;
    // height: 32px;
    padding-top: 10px;
    button {
      width: 100%;
      height: 100%;
      padding: 10px 0;
      color: #fff;
      background-color: #0c8eff;
      border-radius: 3px;
    }
  }
  .form-input {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding: 2px 3px; 
    border-radius: 5px;
    box-sizing: border-box;
  }
  .form-textarea {
    border-radius: 5px;
    font-size: 14px;
    padding: 2px;
    box-sizing: border-box;
  }
}
</style>
