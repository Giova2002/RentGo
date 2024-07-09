import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import { firebase } from '../firebase/firebaseConfig';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserName = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('usuario').doc(user.uid).get();
          if (userDoc.exists) {
            setUserName(userDoc.data().nombre);
          }
        }
      } catch (error) {
        console.error('Error getting user name:', error);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUserName();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#1C252E" />
        ) : (
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
        )}
      </View>
      <Profile />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    color: '#000000',
    fontSize: 19,
    fontFamily: 'Raleway_700Bold',
  },
});

export default Header;
