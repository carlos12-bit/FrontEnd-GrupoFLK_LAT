<template>
  <div class="calendar-container">
    <!-- Calendario -->
    <div class="calendar-section">
      <el-calendar
        v-model="selectedDate"
        :date-cell="customDateCell"
        @input="handleDateClick"
      />
    </div>

    <!-- Detalles de los eventos -->
    <div class="details-section" v-if="selectedEvents.length">
      <div v-for="(event, index) in selectedEvents" :key="index" class="event-card" :style="{ borderColor: event.color }">
        <h3 :style="{ color: event.color }">{{ event.title }}</h3>
        <p><strong>Ubicación:</strong> {{ event.details.location }}</p>
        <p><strong>Hora:</strong> {{ event.details.time }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { GetUser } from '@/auth';  // Asegúrate de que esta ruta esté correcta

export default {
  name: 'CalendarView',
  setup() {
    const events = ref([]);
    const selectedDate = ref(new Date());
    const selectedEvents = ref([]);

    // Obtiene el UUID del usuario registrado
    const userId = GetUser();
    
    // Función para cargar los eventos
    const loadEvents = async () => {
      if (userId) {
        // Asumimos que los procedimientos almacenados están implementados en el backend
        // A continuación, harías la llamada a la API que ejecuta las funciones en tu base de datos
        const responseInspector = await fetch(`/api/inspector-events/${userId}`);
        const inspectorEvents = await responseInspector.json();

        const responseCertificador = await fetch(`/api/certificador-events/${userId}`);
        const certificadorEvents = await responseCertificador.json();

        // Combina ambos eventos
        events.value = [...inspectorEvents, ...certificadorEvents];
      }
    };

    // Personalización de las celdas del calendario
    const customDateCell = ({ date }) => {
      const hasEvent = events.value.some(
        (event) => event.date === date.toISOString().split('T')[0]
      );
      if (hasEvent) {
        return {
          class: 'highlight-date',
          children: `<div class="event-card-summary">Evento</div>`,
        };
      }
      return {};
    };

    // Manejar clic en una fecha
    const handleDateClick = (date) => {
      const formattedDate = date.toISOString().split('T')[0];
      selectedEvents.value = events.value.filter(
        (event) => event.date === formattedDate
      );
    };

    // Cargar los eventos cuando el componente se monta
    onMounted(() => {
      loadEvents();
    });

    return {
      selectedDate,
      customDateCell,
      handleDateClick,
      selectedEvents,
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.calendar-container {
  display: flex;
  gap: 20px;
  max-width: 1000px;
  margin: 20px auto;
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Sección del calendario */
.calendar-section {
  flex: 2;
}

/* Sección de detalles */
.details-section {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #4caf50;
  background: #e7f9ed;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tarjeta de cada evento */
.event-card {
  padding: 10px;
  border: 2px solid;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-card h3 {
  margin: 0 0 5px;
}

.event-card-summary {
  font-size: 12px;
  color: #4caf50;
  font-weight: bold;
  text-align: center;
}

.highlight-date {
  position: relative;
  background: #e7f9ed;
  border: 1px solid #4caf50;
  border-radius: 5px;
  padding: 4px;
}

/* Tarjetas para tareas inspector */
.event-card-inspector {
  border-color: #f7c92e;
  background-color: #fff4b3;
}

/* Tarjetas para tareas certificador */
.event-card-certificador {
  border-color: #32c8f0;
  background-color: #b3e7ff;
}

/* Responsivo: Cambiar disposición en pantallas pequeñas */
@media (max-width: 768px) {
  .calendar-container {
    flex-direction: column;
  }

  .calendar-section {
    flex: none;
  }

  .details-section {
    flex: none;
    max-height: none;
  }
}
</style>