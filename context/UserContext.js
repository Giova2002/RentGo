import React, { createContext, useState, useEffect } from 'react';
// import auth from '@react-native-firebase/auth';
import { firebase } from '../firebase/firebaseConfig';

// Crear el contexto de usuario
export const UserContext = createContext();

// Crear el componente proveedor de contexto
export const UserProvider = ({ children }) => {
    const userId = "iUPxvupTSPDK4czA7dmQ";
  const [user, setUser] = useState(null);

  // Función para obtener la información del usuario
//   const fetchUserData = async () => {
//     const currentUser = auth().currentUser;
//     if (currentUser) {
//       // El usuario está autenticado, obtener su información
//       setUser(currentUser);
//     } else {
//       // El usuario no está autenticado
//       setUser(null);
//     }
//   };

  // Obtener la información del usuario al cargar la aplicación
//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(fetchUserData);
//     return unsubscribe;
//   }, []);

useEffect(() => {
    console.log('jjjiiii')
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

    fetchUserById(userId);
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
