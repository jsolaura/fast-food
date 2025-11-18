import { Slot } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthLayout() {
  return (
    <SafeAreaView>
      <Slot />
    </SafeAreaView>
  )
}