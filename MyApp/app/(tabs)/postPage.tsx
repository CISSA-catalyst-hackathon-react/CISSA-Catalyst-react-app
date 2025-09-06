import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function PostScreen() {
  const router = useRouter();

  // Title input state
  const [title, setTitle] = useState("");
  const [titleHeight, setTitleHeight] = useState(0);

  // Notes input state
  const [notes, setNotes] = useState("");
  const [notesHeight, setNotesHeight] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          {/* Left column */}
          <View style={styles.leftColumn}>
            {/* Title section */}
            <Text style={styles.title}>Plan your creations here 😀</Text>
            <TextInput
              style={[styles.input, { height: Math.max(40, titleHeight) }]}
              placeholder="Enter your creative idea..."
              value={title}
              onChangeText={setTitle}
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e) =>
                setTitleHeight(e.nativeEvent.contentSize.height)
              }
            />

            {/* Notes section */}
            <TextInput
              style={[styles.input, { height: Math.max(60, notesHeight), marginTop: 20 }]}
              placeholder="Write your notes here..."
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              onContentSizeChange={(e) =>
                setNotesHeight(e.nativeEvent.contentSize.height)
              }
            />
          </View>

          {/* Right column */}
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
    paddingTop: 60, // space for absolute back button
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    marginRight: 30,
    flexDirection: "column",
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
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
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
    zIndex: 1000,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
