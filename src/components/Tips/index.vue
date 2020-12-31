<template>
  <div class="tips" v-show="tipvisible">
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    tipvisible: {
      type: Boolean,
      default: false,
    },
    
  },
  data: () => ({
    timer: null,
  }),
  watch: {
    tipvisible: {
        handler (newvisible, oldvisible) {
            if (newvisible) {
                this.timer = setTimeout(() => {
                    this.$emit('update:tipvisible', false)
                    clearTimeout(this.timer);
                    this.timer = null;
                }, 3500);
            }
        },
        immediate:true,
    }
  },
}
</script>

<style lang='scss'>
@keyframes loading-default-anim {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1; 
  }
  90% {
    opacity: 1; 
  }
  100% {
    opacity: 0;
  }
}
.tips {
//   animation: loading-default-anim linear;
  position: fixed;
  min-width: 100px;
  left: 50%;
  top: 50%;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: 14px;
  color: #fff;
  background-color: #666666;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  z-index: 10;
}
</style>
