<!-- Item.vue -->
<template>
  <div class="Item">
    {{id}}
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    console.log('asyncData')
    // 触发 action 后，会返回 Promise
    return store.dispatch("fetchItem", route.params.id);
  },
  data() {
    return {

    }
  },
  computed: {
    id() {
      return this.$store.state.items[this.$route.params.id]
    }
  },
  beforeMount() {
    // 第二种方式
    // this.dataPromise.then(() => {
    //   console.log('dataPromise-done')
    // })
  },
  mounted() {

  },
};
</script>

<style lang="less" scoped>

</style>
