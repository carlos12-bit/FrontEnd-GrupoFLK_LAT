<template>
    <div>
        <h1>Crear Tipo de Inspección</h1>
        <form @submit.prevent="createTipoInspeccion">
        <div>
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" />
        </div>
        <div>
            <label for="descripcion">Descripción</label>
            <input type="text" id="descripcion" v-model="descripcion" />
        </div>
        <button type="submit">Crear</button>
        </form>
    </div>
</template>
<script>
import { supabase } from '../../supabase';

const { data, error } = await supabase
  .from('tipo_de_inspeccion')
  .insert([
    { nombre: '',
    tipo_de_maquinaria_id: 'otherValue' 
    },
  ])
  .select();

</script>