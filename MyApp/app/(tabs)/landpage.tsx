import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import { useState } from "react";
import { Link, useRouter } from "expo-router";

export function LandingSplitView() {
  const [count, setCount] = useState(0);
  const router = useRouter()
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
        <Link href="/" asChild>
          <Button title="Go back?"/>
        </Link>
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
