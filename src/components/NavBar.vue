<style lang="stylus" scoped>
.container
  height 100%
  .nav-bar 
    height 100%
</style>

<template>
  <div class='container'>
    <el-menu class='nav-bar' default-active="/home/groupManage" mode='vertical' :router="true">
      <el-menu-item index='/home/groupManage'>互助群</el-menu-item>
      <el-menu-item index='/home/userManage'>用户管理</el-menu-item>
      <el-menu-item index='/home/passageManage'>福利项目</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  }
}
</script>
