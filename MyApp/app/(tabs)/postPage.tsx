import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function PostScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {/* Back button at top-left */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          {/*left column section */}
          <View style={styles.leftColumn}>
            <Text style={styles.title}>Plan your creations here 😀</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your creative idea..."
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.sectionHeading}>Relationships</Text>
            <Text>- Related idea 1</Text>
            <Text>- Related idea 2</Text>
            <Text>- Related idea 3</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 18,
    paddingTop: 60, // give space for absolute back button
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    marginRight: 30,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowOpacity: 0.4,
    shadowRadius: 23,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 3,
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
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#6e99c8ff",
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 16,
    zIndex: 1000, // ensure it stays above other content
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
