<template>
  <div class="curriculum">
    <Guide :guideVisible.sync='guideVisible' :imgUrl='imgUrl'></Guide>
    <div class="curriculum-banner">
      <img src="https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453067057834496.svg">
      <div
        class="curriculum-explain"
        @click="openExplain"
      >
        <span>课表说明</span>
      </div>
    </div>
    <div class="weekday">
      <!-- <img src="../../../static/image/qr.jpg" alt=""> -->
      <div
        class="time-line"
        v-for="item in ListWidthField"
        :key="item.item">
        <div class="time-line_dash"></div>
        <div class="time-line_list">
          <div class="outer-circle">
            <div class="inner-circle">
            </div>
          </div>
          <div class="week">
            {{item.week}}
          </div>
          <div class="time-line_content">
            <p class="time-line_image"><img :src="item.img" alt=""></p>
            <div class="time-line_text">
              <p class="time-line_title ellipsis">{{ item.title }}</p>
              <p class="time-line_handle">
                <span v-if="item.type == 2">公开课</span> 
                <span v-if="item.type == 1" class="onebyone">1对1外教课</span>
                <button
                  :disabled='handleTime(item.start_time)'
                  :class="handleTime(item.start_time) ? 'after':''"
                  @click="goReserve(item)">去预约</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="curriculum-logo">
      <img src="https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453125681179136.svg" alt="" srcset="">
    </div>
  </div>
</template>

<script>
import Guide from "@/components/guide/index";
const ClassImg = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453130147711488.png';
const appletsImg = 'https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453130534062592.png';

export default {
  name: 'featcurriculum',
  props: {
    ListWidthField: {
      type: Array,
      default: () => {
        return [];
      }
    },
    logged: {
      type: Boolean,
      default: false,
    },
    iscontinue: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    guideVisible: false,                  // 展示图片开关
    imgUrl: '',                             // 展示图片
    CurrentItem: '',                      // 当前 item
    
  }),
  components: {
    Guide,
  },
  watch: {
    iscontinue(value) {
      let { CurrentItem } = this;

      // 为 true 
      if (value) {
        this.goReserve(CurrentItem);
      }
    },
  },
  created() {
    // console.log(this.logged, 78);
    
  },
  mounted() {

  },
  methods: {
    /**
     * 打开课表说明
     */
    openExplain() {
      this.openDialog(ClassImg);
    },
    /**
     * 预约按钮点击
     */
    goReserve({ url, type }) {
      let { logged } = this;
      let eventType = type == 1 ? 501:502;
      // 赋值
      this.CurrentItem = { url, type };

      this.$emit('eventType', eventType);
      
      if (!logged) {
        this.$emit('needLogin', true);
        return;
      }

      if (type == 2) {
        window.location.href = url;
      } else {
        this.openDialog(appletsImg);
      }

      
    },
    /**
     * 打开弹框
     */
    openDialog(img) {
      this.guideVisible = true;
      this.imgUrl = img;
    },
    /**
     * 处理时间
     */
    handleTime(start_time) {
      let flag = false;
      let StartTime = Number(start_time) * 1000;
      let EndTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
// +24*60*60*1000
      // console.log(StartTime, EndTime, StartTime < EndTime, 107);
      if (StartTime < EndTime) {
        flag = true;
      }
      return flag;
    },
  },

}
</script>

<style lang='scss' scoped>
.curriculum {
  width: 100%;
  opacity: 0.84;
  &-banner {
    height: 120px;
    position: relative;
    img {
      display: block!important;
      width: 100%;
    }
  }
  &-explain {
    position: absolute;
    right: 0;
    bottom: 12px;
    width: 76px;
    height: 27px;
    line-height: 27px;
    background: #fff5ab;
    text-align: center;
    border-radius: 50px 0px 0px 50px;
    span {
      font-weight: bold;
      color: rgba(236,169,0,1);
    }
  }
  .weekday {
    width: 100%;
    min-height: calc(100% - 164px);
    padding: 28px 0 10px;
    background-color: #ffffff;
    border-radius: 16px 16px 0;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    &>img {
      width: 100%;
    }
    .time-line {
      display: flex;
      align-items: flex-end;
      &_dash {
        width: 20px;
        height: 150px;
        border-right: 1px dashed #dddddd;
      }
      &_list {
        flex: 1;
        height: 100%;
        position: relative;
        .week {
          font-size: 18px;
          font-weight: 700;
          color: #1e1e1e;
          padding-left: 10px;
          line-height: 22px;
        }
        .outer-circle {
          width: 13px;
          height: 13px;
          background: #ffffff;
          border: 1px solid #26b7ff;
          box-sizing: border-box;
          position: absolute;
          left: -7px;
          top: 3px;
          border-radius: 100%;
        }
        .inner-circle {
          width: 9px;
          height: 9px;
          background: #ffffff;
          border: 2px solid #26b7ff;
          box-sizing: border-box;
          position: absolute;
          left: 1px;
          top: 1px;
          border-radius: 100%;
        }
      }
      &_content {
        width: calc(100% - 20px);
        display: flex;
        margin: 8px 0 20px 10px;
        padding: 16px 10px;
        border-radius: 10px;
        box-sizing: border-box;
        background-color: #F8F8F8;
      }
      &_image {
        width: 110px;
        height: 84px;
        padding-left: 6px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &_text {
        padding-left: 10px;
        flex: 1;
      }
      &_title {
        font-size: 16px;
        font-weight: bold;
        color: #1e1e1e;
      }
      &_handle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        span {
          font-size: 12px;
          padding: 1px 4px;
          border-radius: 4px;
          border: 1px solid #2aca46;
          font-weight: bold;
          box-sizing: border-box;
          box-sizing: content-box;
          color: #39BD24;
          background-color: #E0FAE0;
          &.onebyone {
            color: #26b7ff;
            border: 1px solid #26b7ff;
            background-color: #e9f7ff;
          }
        }
        button {
          font-size: 16px;
          color: rgba(83,68,64,1);
          padding: 8px 16px;
          font-weight: bold;
          border-radius: 50px;
          background-color: rgba(255,232,60,1);
          &.active {
            color: #8C8C8C;
            
          }
          &.after {
            background-color: rgba(227,227,227,1);
          }
        }
      }
      &:last-child {
        .time-line_dash {
          border-right: 0;
        }
      }
    }
  }
  &-logo {
    text-align: center;
    height: 14px;
    margin-bottom: 30px;
    img {
      width: 156px;
    }
  }
}
@media screen and (max-width: 321px) {
  .curriculum {
    .weekday {
      .time-line_image {
        width: 90px;
      }
      .time-line_handle {
        button {
          padding: 8px 13px;
        }
      }
    }
  }
}

@media screen and (min-width: 321px) and (max-width: 374px) {
  .curriculum {
    .weekday {
      .time-line_image {
        width: 90px;
      }
      .time-line_handle {
        button {
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>
