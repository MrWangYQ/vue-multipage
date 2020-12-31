<!--
 *
 * loadingGif组件--"数据请求中"
 *
 * 使用方法：
 * <loading-gif :show-loading="showLoaddingGif"></loading-gif>
 *
 *  通过修改showLoaddingGif的true或者false 来控制loading的显示和隐藏!
 *
 -->
<template>
  <div class="loading" v-show="showLoading">
    <div class="loading-default-css" style="transform:scale(0.3);">
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(0deg) translate(0,-60px);transform:rotate(0deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(30deg) translate(0,-60px);transform:rotate(30deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(60deg) translate(0,-60px);transform:rotate(60deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(90deg) translate(0,-60px);transform:rotate(90deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(120deg) translate(0,-60px);transform:rotate(120deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(150deg) translate(0,-60px);transform:rotate(150deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(180deg) translate(0,-60px);transform:rotate(180deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(210deg) translate(0,-60px);transform:rotate(210deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(240deg) translate(0,-60px);transform:rotate(240deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(270deg) translate(0,-60px);transform:rotate(270deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(300deg) translate(0,-60px);transform:rotate(300deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
      <div
        style="top:80px;left:93px;width:14px;height:40px;background:#2196F3;-webkit-transform:rotate(330deg) translate(0,-60px);transform:rotate(330deg) translate(0,-60px);border-radius:10px;position:absolute;"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showLoading"]
};
</script>

<style lang="scss" rel="stylesheet/scss">
@-webkit-keyframes loading-default-anim {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes loading-default-anim {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.loading-default-css {
  position: relative;
  background: none;
  width: 200px;
  height: 200px;
}
.loading-default-css > div:nth-of-type(1) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.loading-default-css > div:nth-of-type(2) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.4166666666666667s;
  animation-delay: -0.4166666666666667s;
}

.loading-default-css > div:nth-of-type(3) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.33333333333333337s;
  animation-delay: -0.33333333333333337s;
}

.loading-default-css > div:nth-of-type(4) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.25s;
  animation-delay: -0.25s;
}

.loading-default-css > div:nth-of-type(5) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.16666666666666669s;
  animation-delay: -0.16666666666666669s;
}

.loading-default-css > div:nth-of-type(6) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: -0.08333333333333331s;
  animation-delay: -0.08333333333333331s;
}

.loading-default-css > div:nth-of-type(7) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.loading-default-css > div:nth-of-type(8) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0.08333333333333337s;
  animation-delay: 0.08333333333333337s;
}

.loading-default-css > div:nth-of-type(9) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0.16666666666666663s;
  animation-delay: 0.16666666666666663s;
}

.loading-default-css > div:nth-of-type(10) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0.25s;
  animation-delay: 0.25s;
}

.loading-default-css > div:nth-of-type(11) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0.33333333333333337s;
  animation-delay: 0.33333333333333337s;
}

.loading-default-css > div:nth-of-type(12) {
  -webkit-animation: loading-default-anim 1s linear infinite;
  animation: loading-default-anim 1s linear infinite;
  -webkit-animation-delay: 0.41666666666666663s;
  animation-delay: 0.41666666666666663s;
}

</style>