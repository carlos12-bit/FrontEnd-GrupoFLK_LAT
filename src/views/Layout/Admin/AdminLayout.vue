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
  background-color: #fcfcfc; /* Mantén el color principal */
  opacity: 0.8; /* Transparencia ligera */
  background-size: cover; /* Elimina las líneas repetitivas */
  background-image: none; /* Quita las líneas verticales */
}
</style>

