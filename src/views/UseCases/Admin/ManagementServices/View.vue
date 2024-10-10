<template>
  <ManagementTypesInspeccion />
  <ManagementTypeMachinery />
</template>

<script>
import ManagementTypesInspeccion from './ManagementTypesInspeccion/View.vue';
import ManagementTypeMachinery from './ManagementTypeMachinery/View.vue';

export default {
  components: {
    ManagementTypesInspeccion,
    ManagementTypeMachinery
  },
};
</script>