<template>
  <div class="event-details">
    <h3>Detalles de los Eventos</h3>
    <div v-for="(event, index) in events" :key="index" class="event-item">
      <p><strong>Evento:</strong> {{ event.title }}</p>
      <p><strong>Ubicación:</strong> {{ event.details.location }}</p>
      <p><strong>Hora:</strong> {{ event.details.time }}</p>
      <hr v-if="index < events.length - 1" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
.event-details {
  margin: 0;
  padding: 10px;
}

.event-details h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #4caf50;
}

.event-item {
  margin-bottom: 10px;
}

.event-item p {
  margin: 5px 0;
}
</style>
