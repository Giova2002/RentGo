import { View, Text } from 'react-native'
import React from 'react'
import Header from '../header/Header'
import Profile from '../header/Profile'

export default function Home() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
       <Header />
       <Profile />
      <Text>Home</Text>
    </View>
  )
}