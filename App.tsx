import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { CricketCommentary } from './src/components/CricketCommentary';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <CricketCommentary />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
