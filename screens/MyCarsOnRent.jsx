import { View, Text } from 'react-native'
import React from 'react'
import Header from '../header/Header'
import Profile from '../header/Profile'

export default function MyCarsOnRent() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Header />
      <Text>MyCarsOnRent</Text>
    </View>
  )
}