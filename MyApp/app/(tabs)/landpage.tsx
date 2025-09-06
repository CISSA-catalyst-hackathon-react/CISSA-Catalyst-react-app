import { View, Text, StyleSheet, Button, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

export default function PostScreen() {
  const [count, setCount] = useState(0);
  const [rectangles, setRectangles] = useState<number[]>([]);
  const [inputs, setInputs] = useState<string[]>([]);

  const handleAddRectangle = () => {
    setRectangles([...rectangles, rectangles.length]);
    setInputs([...inputs, ""]);
  };

  const handleInputChange = (text: string, idx: number) => {
    const newInputs = [...inputs];
    newInputs[idx] = text;
    setInputs(newInputs);
  };

  // Only allow adding if last input is filled or no rectangles yet
  const canAddRectangle =
    rectangles.length === 0 || (inputs[inputs.length - 1] && inputs[inputs.length - 1].trim().length > 0);

  // Group rectangles into rows of 3
  const rows = [];
  for (let i = 0; i < rectangles.length; i += 3) {
    rows.push(rectangles.slice(i, i + 3));
  }

  return (
    <View style={styles.splitContainer}>
      <View style={styles.leftPane}>
        <Text style={styles.leftTitle}>Sidebar</Text>
        <Button title="Go back?" onPress={() => {}} />
        <Button title="+" onPress={handleAddRectangle} disabled={!canAddRectangle} />
      </View>
      <ScrollView style={styles.rightPane} contentContainerStyle={styles.rightPaneContent}>
        <Text style={styles.title}>Hello from Post Page 👋</Text>
        <Text style={styles.subtitle}>You clicked {count} times</Text>
        <Button title="Click me" onPress={() => setCount(count + 1)} />
        {/* Render rectangles in rows */}
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.rectangleRow}>
            {row.map((rect, idx) => {
              const globalIdx = rowIdx * 3 + idx;
              return (
                <View key={globalIdx} style={styles.rectangleContainer}>
                  <View style={styles.rectangle} />
                  <TextInput
                    style={styles.input}
                    value={inputs[globalIdx] || ""}
                    onChangeText={text => handleInputChange(text, globalIdx)}
                    placeholder="Enter text"
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
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
    width: 80,
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
    backgroundColor: "#fff",
  },
  rightPaneContent: {
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
  rectangleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rectangleContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  rectangle: {
    width: 300,
    height: 450,
    backgroundColor: "#90caf9",
    borderRadius: 8,
    marginBottom: 6,
  },
  input: {
    width: 100,
    height: 32,
    borderColor: "#90caf9",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
});
