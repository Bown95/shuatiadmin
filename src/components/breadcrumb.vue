<template>
  <div class="page">
      <Breadcrumb class="breadcrumb">
        <BreadcrumbItem to="/home/homepage">首页</BreadcrumbItem>
        <BreadcrumbItem v-if=!tag>{{ $route.meta.title}}</BreadcrumbItem>
      </Breadcrumb>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      tag:''
    }
  },
  components: {

  },
  props:['zhi']
}
</script>

<style scoped lang="less">
.breadcrumb {
    // border-bottom: 1px solid #ccc;
    padding: 0 20px;
    margin-top: 15px;
    span:nth-child(2) {
        font-size: 14px;
        font-weight: 400;
    }
}
</style>
