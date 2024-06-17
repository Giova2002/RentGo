import React, { createContext, useState, useEffect } from 'react';
import { firebase } from '../firebase/firebaseConfig'; // Asegúrate de que la configuración de firebase esté correcta

// Crear el contexto de usuario
export const UserContext = createContext();

// Crear el componente proveedor de contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para obtener la información del usuario desde Firestore
  const fetchUserById = async (userId) => {
    try {
      const doc = await firebase.firestore().collection('usuario').doc(userId).get();
      if (doc.exists) {
        setUser({ id: doc.id, ...doc.data() });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Función para manejar los cambios de autenticación
  const handleAuthStateChanged = async (currentUser) => {
    if (currentUser) {
      console.log('Usuario autenticado:', currentUser);
      await fetchUserById(currentUser.uid); // Obtén la información del usuario desde Firestore usando el UID
    } else {
      console.log('Usuario no autenticado');
      setUser(null);
    }
  };

  // Escuchar los cambios de autenticación al cargar la aplicación
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthStateChanged);
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;