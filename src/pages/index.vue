<template>
  <div class="index">
    <img class="index-img" src="~/assets/img/index-home.png" alt="homeImg" />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>
<style lang="less" scoped>
.index {
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .index-img {
    width: 300px;
    height: 245px;
  }
}
</style>
