import { View, Text } from 'react-native'
import React from 'react'
import Reserva from './Reserva'
import Header from '../header/Header'
import Profile from '../header/Profile'

export default function Likes() {
  return (
    <View style={{flex: 1, alignItems: "center"}}>
      <Header />
       <Text>Likes</Text>
    </View>
  )
}