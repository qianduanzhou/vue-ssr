<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/item/init">Item-init</router-link>
    <router-link to="/item/get">Item-get</router-link>
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
