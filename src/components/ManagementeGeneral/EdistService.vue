<template>

<h1>Editar Servicio</h1>
<form @submit.prevent="editService">
    <div>
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" v-model="nombre" />
    </div>
    <div>
        <label for="descripcion">Descripción</label>
        <input type="text" id="descripcion" v-model="descripcion" />
    </div>
    <button type="submit">Editar</button>
</form>
</template>

<script>
import { supabase } from '../../supabase';
const { data, error } = await supabase
  .from('tipo_de_inspeccion')
  .update([
    { nombre: '',
    tipo_de_maquinaria_id: 'otherValue' 
    },
  ])
  .select();

</script>