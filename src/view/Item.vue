<!-- Item.vue -->
<template>
  <div class="Item">
    {{item}}
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch("fetchItem", route.params.id);
  },
  computed: {
    ...mapGetters({
      item: 'getItems'
    }),
  },
  mounted() {
    console.log('this.$store.state', this.$store.state)
  },
};
</script>

<style lang="less" scoped>

</style>
