<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#fff"
      default-active="2"
      class="left-menu"
      @open="handleOpen"
      @close="handleClose"
      router="true"
  >
    <el-menu-item index="/cview/chat">
      <el-icon>
        <Bell />
      </el-icon>
      <span>Single</span>
    </el-menu-item>
    <el-menu-item index="/cview/groupchat">
      <el-icon>
        <Bell />
      </el-icon>
      <span>Group</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "asideMenu"
}
</script>

<style scoped>
.left-menu {
  height: 100vh;
}
</style>