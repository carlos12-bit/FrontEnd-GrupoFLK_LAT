<template>
  <el-aside width="200px" class="sidebar">
    <el-menu default-active="1">
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <router-link to="/">Inicio</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-user"></i>
        <router-link to="/profile">Perfil</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <router-link to="/settings">Configuración</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-document"></i>
        <router-link to="/reports">Reportes</router-link>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  background-color: #333;
  color: white;
}
</style>
