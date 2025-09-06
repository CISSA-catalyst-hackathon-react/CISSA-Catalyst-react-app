import { View, Text, StyleSheet, Button } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function PostScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.splitContainer}>
      <View style={styles.leftPane}>
        <Text style={styles.leftTitle}>Sidebar</Text>
        <Button title="Go back?" onPress={() => {}} />
        {/* Add more sidebar buttons or content here */}
      </View>
      <View style={styles.rightPane}>
        <Text style={styles.title}>Hello from land Page 👋</Text>
        <Text style={styles.subtitle}>You clicked {count} times</Text>
        <Button title="Click me" onPress={() => setCount(count + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },
  leftPane: {
    width: 80, // smaller sidebar
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  leftTitle: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  rightPane: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});
