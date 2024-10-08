import { supabase } from './supabase';

// Función para iniciar sesión
export async function login(email, password) {
  // Realiza el login del usuario
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error; // Manejar error en el login
  }

  const user = data.user; // Obtener el usuario autenticado

  // Si el login es exitoso, ahora obtenemos el rol del usuario desde la tabla AsignacionDeUsuario
  const { data: rolData, error: rolError } = await supabase
    .from('asignaciondeusuario') // Asegúrate de que el nombre de la tabla sea correcto
    .select('rol') // Selecciona el campo de rol
    .eq('id', user.id) // Compara con el ID del usuario (el UUID del usuario)
    .single(); // Aseguramos que solo obtenga un registro

  if (rolError) {
    throw rolError; // Manejar error en la obtención del rol
  }

  const rolId = rolData.rol; // Extraemos el ID del rol del resultado

  // Devolver el usuario y el ID del rol
  return { user, rolId };
}


// Función para cerrar sesión
export async function logout() {
  await supabase.auth.signOut(); // Cierra sesión en Supabase
  localStorage.removeItem('user'); // Elimina el usuario almacenado en localStorage
  window.location.href = '/login'; // Redirige al usuario a la página de login
}

// Obtener la sesión actual
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Función para buscar el rol del usuario en la tabla AsignacionDeUsuario
export async function buscarRol(userId) {
  const { data, error } = await supabase
    .from('asignaciondeusuario') // Asegúrate de que el nombre de la tabla esté en minúsculas
    .select('rol') // Selecciona solo el campo de rol
    .eq('id', userId) // Compara con el ID del usuario (UUID)
    .single(); // Obtiene un único registro

  if (error) {
    throw new Error('No se pudo obtener el rol del usuario');
  }

  return { rolId: data.rol }; // Devuelve el ID del rol
}

// Hacer una solicitud autenticada
async function fetchDatosProtegidos() {
  const { data, error } = await supabase
    .from('datos_protegidos')
    .select('*');
  
  if (error) {
    console.error('Error al obtener los datos:', error);
  } else {
    console.log('Datos obtenidos:', data);
  }
}
fetchDatosProtegidos(); // Llama a la función para obtener los datos protegidos