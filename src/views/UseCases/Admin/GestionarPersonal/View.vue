<!-- src/components/DataTable.vue -->
<template>
  <div class="data-table-container">
    <h2 class="text-center mb-4">Ejemplo de DataTable</h2>

    <el-input
      placeholder="Buscar por nombre o email"
      v-model="searchQuery"
      class="mb-3 search-input"


      
    />

    <el-select v-model="itemsPerPage" class="mb-3 page-size-select" placeholder="Items por página">
      <el-option label="5" :value="5" />
      <el-option label="10" :value="10" />
      <el-option label="15" :value="15" />
      <el-option label="20" :value="20" />
    </el-select>

    <el-table :data="paginatedUsers" style="width: 100%" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column
        prop="name"
        label="Nombre"
        sortable
        :sort-method="(a, b) => a.name.localeCompare(b.name)"
      />
      <el-table-column
        prop="email"
        label="Email"
        sortable
        :sort-method="(a, b) => a.email.localeCompare(b.email)"
      />
    </el-table>

    <el-pagination
      @current-change="currentPage = $event"
      :current-page="currentPage"
      :page-size="itemsPerPage"
      :total="filteredUsers.length"
      layout="total, prev, pager, next"
      class="pagination mt-4"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com' },
        { id: 2, name: 'Ana Gómez', email: 'ana.gomez@example.com' },
        { id: 3, name: 'Luis Martínez', email: 'luis.martinez@example.com' },
        { id: 4, name: 'Laura Torres', email: 'laura.torres@example.com' },
        { id: 5, name: 'Pedro Fernández', email: 'pedro.fernandez@example.com' },
        { id: 6, name: 'Sara López', email: 'sara.lopez@example.com' },
        { id: 7, name: 'Miguel Silva', email: 'miguel.silva@example.com' },
        { id: 8, name: 'Clara Ruiz', email: 'clara.ruiz@example.com' },
        { id: 9, name: 'Javier Castillo', email: 'javier.castillo@example.com' },
        { id: 10, name: 'Teresa Mendoza', email: 'teresa.mendoza@example.com' },
      ],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsers.slice(start, start + this.itemsPerPage);
    },
  },
};
</script>

<style scoped>
.data-table-container {
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.search-input {
  width: 100%;
}

.page-size-select {
  width: 25%;
}

.el-table th {
  background-color: #f5f5f5;
  color: #333;
  font-weight: bold;
}

.el-table td {
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
}

.pagination .el-pagination {
  margin-top: 20px;
}
</style>
