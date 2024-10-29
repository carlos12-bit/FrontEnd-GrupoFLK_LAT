 <template>
  <div class="credentials-layout">
    <h1 class="page-title">Credenciales de Alumnos</h1>
    <div class="table-container">
      <table class="credentials-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Documento</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="credencial in credenciales" :key="credencial.id">
            <td>{{ credencial.usuario }}</td>
            <td>{{ obtenerDocumento(credencial.FK_Operador) }}</td>
            <td>
              <button @click="generarCredencial(credencial)" class="btn-generar">Generar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase.js';

export default {
  name: "ManageCredentials",
  data() {
    return {
      credenciales: [], // Almacena las credenciales de la base de datos
      operadores: [] // Almacena los operadores para obtener el tipo de documento
    };
  },
  async mounted() {
    // Obtener las credenciales desde la tabla "credenciales_alumnos" en Supabase
    const { data: credenciales, error: credencialesError } = await supabase
      .from('credenciales_alumnos')
      .select('*');

    if (credencialesError) {
      console.error("Error fetching credenciales: ", credencialesError);
    } else {
      this.credenciales = credenciales;
    }

    // Obtener los operadores para enlazar con "FK_Operador" y extraer el tipo de documento
    const { data: operadores, error: operadoresError } = await supabase
      .from('Operador')
      .select('Pk_Alumno, nro_documento');

    if (operadoresError) {
      console.error("Error fetching operadores: ", operadoresError);
    } else {
      this.operadores = operadores;
    }
  },
  methods: {
    obtenerDocumento(fkOperador) {
      // Encuentra el operador por "FK_Operador" y devuelve el número de documento
      const operador = this.operadores.find(op => op.Pk_Alumno === fkOperador);
      return operador ? operador.nro_documento : 'Desconocido';
    },
    generarCredencial(credencial) {
      // Lógica para generar credencial
      alert(`Generando credencial para: ${credencial.usuario}`);
      // Aquí puedes añadir la lógica para generar o actualizar la credencial en la base de datos
    }
  }
};
</script>

<style scoped>
.credentials-layout {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.credentials-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.credentials-table th, .credentials-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.credentials-table th {
  background-color: #333;
  color: #fff;
  font-size: 1.2rem;
}

.credentials-table td {
  font-size: 1rem;
}

.btn-generar {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-generar:hover {
  background-color: #218838;
}
</style>

