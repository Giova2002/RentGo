import { Text, StyleSheet, View,Image } from 'react-native'
import React, { useState } from 'react'

export default function Login() {
    return (
      <View>
        <View>
            <Image source={require('../assets/profile1.png')} style={styles.profile}/>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({})