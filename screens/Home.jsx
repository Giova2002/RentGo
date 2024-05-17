import { View, Text } from 'react-native'
import React from 'react'
import Header from '../header/Header'

export default function Home() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
       <Header />
      <Text>Home</Text>
    </View>
  )
}