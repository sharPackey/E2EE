<template>
  <div class="common-layout">
    <el-container class="admin-wrapper">
      <el-aside width="200px" class="myAside">
        <el-scrollbar>
          <asideMenu></asideMenu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import asideMenu from"@/components/asideMenu.vue"

export default {
  name: "chatView",
  components: {asideMenu},
}
</script>

<style scoped>
.common-layout {
  padding: 0;
  margin: 0;
  height: 100%;
}

.admin-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.myAside {
  height: 100%;
  background-color: #545c64;
}

</style>