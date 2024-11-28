<template>
  <div class="asistencias-container">
    <main class="main-content">
      <h1>Mis asistencias</h1>
      <h2>ACTIVIDADES DE PROMOCIÓN EN PRIMEROS AUXILIOS</h2>
      <section class="chart-section">
        <div id="chart" style="width: 300px; height: 300px;"></div>
      </section>
      <section class="table-section">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Asistencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in asistenciaData" :key="item.fecha">
              <td>{{ item.fecha }}</td>
              <td>{{ item.estado }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      asistenciaData: [
        { fecha: "06/05", estado: "A" },
        { fecha: "05/05", estado: "A" },
        { fecha: "29/04", estado: "A" },
        { fecha: "28/04", estado: "A" },
        { fecha: "21/04", estado: "A" },
      ],
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const chartDom = document.getElementById("chart");
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
        },
        series: [
          {
            name: "Asistencia",
            type: "pie",
            radius: "50%",
            data: [
              { value: 58.3, name: "Asistencia" },
              { value: 41.7, name: "Inasistencia" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.asistencias-container {
  display: flex;
}
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #6a1b9a;
  color: #fff;
}
.sidebar {
  width: 200px;
  background: #4a148c;
  color: #fff;
  height: 100vh;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
}
.sidebar .active {
  background: #7b1fa2;
}
.main-content {
  flex-grow: 1;
  padding: 20px;
}
.chart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.table-section {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  background: #f3f3f3;
  text-align: left;
}
tbody td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>