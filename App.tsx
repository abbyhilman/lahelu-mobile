import React from 'react';
import HomeScreen from '@/pages/HomeScreen';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/utils/sizes';

import { LogBox } from "react-native";

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Possible unhandled promise rejection (id:0: Network request failed)',
  'VirtualizedList: You have a large list that is slow to update',
]);

LogBox.ignoreAllLogs(true);

export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "ios" ? spacing.md : spacing.xl2,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
});