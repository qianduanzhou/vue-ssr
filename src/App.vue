<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/item/5">Item</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
