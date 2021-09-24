import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import LogInButton from '../components/login/LogInButton';

export default function App() {
  return (
    <View style={styles.container}>
      <LogInButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInButton: {
    
  }
});
