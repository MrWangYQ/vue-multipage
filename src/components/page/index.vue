<template>
  <div class="page-com">
    <div class="page-content" id="page-content">
      <slot></slot>
    </div>
    <div class="page-footer" id="page-footer" :style="isFooter ? 'height: 56px;':''">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>


export default {
  name: 'page',
  props: {
    btnName: {
      type: String,
      default: '按钮',
    },
    isFooter: {
      type: Boolean,
      default: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.page-com {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-color: rgba(166,166,166,1);
  .page-content {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    img {
      width: 100%;
    }
  }
  .page-footer {
    width: 100%;
    // height: 56px;
    // background-color: #fff;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    button {
      width: 290px;
      height: 44px;
      border-radius: 22px;
      font-size: 16px;
      color: #685753;
      background-color: #FFE83C;
      border: none;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      i {
        font-weight: 700;
        font-size: 18px;
        margin-right: 5px;
      }
    }
  }
}
</style>
