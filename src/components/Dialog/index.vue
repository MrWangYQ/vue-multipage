<template>
  <div class="dialog" v-show="dialogvisible">

  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: '',
    },
    dialogvisible: {

    }
  },
  name: 'Dialog',
  data: () => ({
    timer: null,
  }),
  watch: {
    dialogvisible(newvisible, oldvisible) {
      
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style>

</style>
