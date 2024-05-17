import { View, Text } from 'react-native'
import React from 'react'
import Header from '../header/Header'
import Profile from '../header/Profile'

export default function Cars() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Header />
       <Profile />
      <Text>Cars</Text>
    </View>
  )
}