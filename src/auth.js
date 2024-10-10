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

  const session = data.session; // Obtener la sesión que contiene el JWT
  const user = data.user; // Obtener el usuario autenticado
  const userId = user.id; // Obtener el ID del usuario
  const jwt = session.access_token; // Obtener el token JWT
  // Guardar el JWT y el usuario en localStorage
  localStorage.setItem('jwt', jwt); // Asegurarse de que el JWT se guarde correctamente
  localStorage.setItem('user', JSON.stringify(user)); // Guardar los datos del usuario
  localStorage.setItem('useriddsadd', userId); // Guardar los datos del usuario
  console.log('Usuario', user.id, 'ha iniciado sesión'); // Mostrar mensaje en consola

  // Obtener el rol del usuario desde la tabla AsignacionDeUsuario
  const { data: rolData, error: rolError } = await supabase
    .from('asignaciondeusuario')
    .select('rol')
    .eq('id', user.id)
    .single(); // Solo obtener un registro

  if (rolError) {
    throw rolError; // Manejar error en la obtención del rol
  }

  const rolId = rolData.rol; // Extraemos el ID del rol del resultado

  // Devolver el usuario y el ID del rol
  return { user, rolId, jwt };
}
// Función para cerrar sesión
export async function logout() {
  await supabase.auth.signOut(); // Cierra sesión en Supabase
  localStorage.removeItem('user'); // Elimina el usuario almacenado en localStorage
  localStorage.removeItem('jwt');  // Elimina el JWT
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

// Hacer una solicitud autenticada con el JWT
export async function fetchDatosProtegidos() {
  // Obtener el JWT de localStorage
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    throw new Error('JWT no encontrado, por favor inicia sesión');
  }

  // Hacer la solicitud HTTP con el JWT en las cabeceras
  const response = await fetch('https://qyfrfgcefvwpkqtzjjxi.supabase.co/rest/v1/datos_protegidos', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`, // Incluir el JWT en la cabecera
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Error al obtener los datos protegidos:', data);
  } else {
    console.log('Datos obtenidos:', data);
  }

  return data;
}

export function getJWT() {
  return localStorage.getItem('jwt');
}

export function GetUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : null; // Devolver solo el ID del usuario
}