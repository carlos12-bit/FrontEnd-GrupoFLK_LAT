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
import { ref } from 'vue';

export default {
  name: 'CalendarView',
  setup() {
    // Lista de eventos
    const events = ref([
      {
        date: '2024-11-15',
        title: 'Realizar visita de soporte',
        color: '#4caf50', // Verde
        details: {
          location: 'Oficina Principal, Calle 123',
          time: '10:00 AM',
        },
      },
      {
        date: '2024-11-18',
        title: 'Revisión del sistema',
        color: '#4caf50', // Verde
        details: {
          location: 'Sucursal Norte, Calle 456',
          time: '9:00 AM',
        },
      },
      {
        date: '2024-11-18',
        title: 'Capacitación del equipo',
        color: '#4caf50', // Verde
        details: {
          location: 'Sala de reuniones, Planta Baja',
          time: '1:00 PM',
        },
      },
      {
        date: '2024-11-18',
        title: 'Cierre del proyecto',
        color: '#4caf50', // Verde
        details: {
          location: 'Oficina Principal, Sala de Conferencias',
          time: '4:00 PM',
        },
      },
      {
        date: '2024-11-18',
        title: 'Revisión urgente del sistema',
        color: '#f44336', // Rojo
        details: {
          location: 'Centro de datos, Sala 101',
          time: '8:00 AM',
        },
      },
    ]);

    const selectedDate = ref(new Date());
    const selectedEvents = ref([]);

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

    return {
      selectedDate,
      customDateCell,
      handleDateClick,
      selectedEvents,
    };
  },
};
</script>

<style>
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