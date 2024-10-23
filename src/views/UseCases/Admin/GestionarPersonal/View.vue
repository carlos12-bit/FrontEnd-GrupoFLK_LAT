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
import supabase from '@/supabase'

export default {
  data() {
    return {
      Inspectores: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredUsers() {
      return this.Inspectores.filter((user) => {
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
  async created() {
    let { data: inspector, error } = await supabase
      .from('inspector')
      .select('*')
    if (error) {
      console.error(error);
    } else {
      this.Inspectores = inspector;
    }
  }
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
