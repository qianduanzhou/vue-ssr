<!-- Item.vue -->
<template>
  <div class="Item">
    {{item}}
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch("fetchItem", route.params.id);
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item() {
      console.log('this.$store.state.items', this.$store.state.items)
      return this.$store.state.items[this.$route.params.id];
    }
  },
  mounted() {
    console.log('this.$store.state', this.$store.state)
  }
};
</script>

<style lang="less" scoped>

</style>
