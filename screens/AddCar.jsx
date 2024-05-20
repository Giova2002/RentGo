import { View, Text } from 'react-native'
import React from 'react'
import Header from '../header/Header'
import Profile from '../header/Profile'

export default function AddCar() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Header />
      <Text>AddCar</Text>
    </View>
  )
}