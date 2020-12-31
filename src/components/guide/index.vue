<template>
  <div class="guide" v-show="guideVisible" @click.stop="hiddenGuide">
    <div v-if="imgUrl" class="image-content">
      <img :src="imgUrl" alt="">
    </div>
    <div v-else class="share-content">
      <img src="https://beaconprod.oss-cn-beijing.aliyuncs.com/image/453125986617856.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'guide',
  props: {
    guideVisible: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    hiddenGuide() {
      this.$emit('update:guideVisible', false);
    },
  }
}
</script>

<style lang='scss' scoped>
  .guide {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 300;
    img {
      width: 100%;
    }
    .share-content {
      width: 70%;
      float: right;
      margin: 10px 10px 0 0;
    }
    .image-content {
      width: 80vw;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -40vw;
      margin-top: -70vw;
    }
  }
</style>
