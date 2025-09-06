import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";


export default function PostScreen() {
  const [count, setCount] = useState(0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hello from Post Page 👋</Text>
      <Text style={styles.subtitle}>You clicked {count} times</Text>
      <Link href="/" asChild>
        <Button title="Go back?"  />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
