import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons"

const CustomHeaderButton = ({children}) => {
  return (
    <View
    style={styles.container}
    >
        {children}
    </View>
  )
}

export default CustomHeaderButton

const styles = StyleSheet.create({
  container:{
    
  }
})