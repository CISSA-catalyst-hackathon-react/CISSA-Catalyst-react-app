import { View, Text, StyleSheet, Button, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function PostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Row layout */}
      <View style={styles.row}>

        {/* Left Column */}
        <View style={styles.leftColumn}>
          <Button title="← Back to homepage" onPress={() => router.back()} />
          <Text style={styles.title}>Plan your creations here 😀</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your creative idea..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          <Text style={styles.sectionHeading}>Relationships</Text>
          <Text>- Related idea 1</Text>
          <Text>- Related idea 2</Text>
          <Text>- Related idea 3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 18,
  },
  row: {
    flexDirection: "row", // side by side
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    /*
    elevation: 2, // shadow (works on Android)
    shadowColor: "#000", // shadow (iOS)
    */
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center"
  },
});
