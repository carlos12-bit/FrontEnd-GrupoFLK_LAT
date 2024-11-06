<template>
  <el-container style="height: 100vh">
    <Drawer ref="drawer" class="d-md-none" />
      <el-container>
      <el-main class="iso">
      <router-view class="mt-5"></router-view>
      </el-main>
      </el-container>
  </el-container>
</template>

<script>
import Drawer from './Drawer.vue';

export default {
  components: {
    Drawer
  },
};
</script>

<style>
.iso {
  background-color: #e5e5f7;
opacity: 0.8;
background-size: 20px 20px;
background-image:  repeating-linear-gradient(to right, #7095d2, #7095d2 1px, #e5e5f7 1px, #e5e5f7);
}
</style>