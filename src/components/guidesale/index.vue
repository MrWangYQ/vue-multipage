<template>
  <div class="guide-sale" v-show="guideSaleVisible" @click.stop="hiddenSaleGuide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'guide',
  props: {
    guideSaleVisible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hiddenSaleGuide() {
      this.$emit('update:guideSaleVisible', false);
    },
  }
}
</script>

<style lang='scss' scoped>
  .guide-sale {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 300;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }

    // .image-content {
    //   width: 80vw;
    //   position: absolute;
    //   left: 50%;
    //   top: 50%;
    //   margin-left: -40vw;
    //   margin-top: -70vw;
    // }
  }
</style>
