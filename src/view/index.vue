<template>
  <div class="index">
    <p>index</p>
    <img src="../static/img/logo-48.png" alt="">
  </div>
</template>

<script>
export default {
  components: {},
  // 定义属性
  data() {
    return {
      img: ''
    };
  },
  // 计算属性，会监听依赖属性值随之变化
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log('process.env.VUE_ENV', process.env.VUE_ENV)
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="less" scoped>
  .index {
    color: red;
    .img {
      width: 100px;
      height: 100px;
      background: url('../static/img/logo-48.png')
    }
  }
</style>