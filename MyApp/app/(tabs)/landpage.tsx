import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export function LandingSplitView() {
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.button}>
          <Text>Btn 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Btn 2</Text>
        </TouchableOpacity>
        {/* Add more buttons as needed */}
      </View>
      <View style={styles.content}>
        {/* Right side is empty for now */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 60, // Thin sidebar
    backgroundColor: '#eee',
    alignItems: 'center',
    paddingVertical: 16,
  },
  button: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
