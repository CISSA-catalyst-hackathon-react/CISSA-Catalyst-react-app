import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function PostScreen() {
  const [rectangles, setRectangles] = useState<number[]>([]);
  const [inputs, setInputs] = useState<string[]>([]);
  const [images, setImages] = useState<(string | null)[]>([]);
  const router = useRouter();

  const handleAddRectangle = () => {
    setRectangles([...rectangles, rectangles.length]);
    setInputs([...inputs, ""]);
    setImages([...images, null]);
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

  // Handle rectangle click: navigate to DashboardView with index or name
  const handleRectanglePress = (idx: number) => {
    router.push({
      pathname: "/(tabs)/DashboardView",
      params: { dashboardId: idx, dashboardName: inputs[idx] }
    });
  };

  // Handle image picker
  const handlePickImage = async (idx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [...images];
      newImages[idx] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  return (
    <View style={styles.splitContainer}>
      <View style={styles.leftPane}>
        <Text style={styles.leftTitle}>Sidebar</Text>
        <Button title="back" onPress={() => router.push("../(tabs)/index")} />
        <Button title="+" onPress={handleAddRectangle} disabled={!canAddRectangle}/>
      </View>

      <ScrollView style={styles.rightPane} contentContainerStyle={styles.rightPaneContent}>
        <Text style={styles.title}>Landing Page</Text>
        <Text style={styles.title}>Add your dashboard!</Text>
        {/* Render rectangles in rows */}
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.rectangleRow}>
            {row.map((rect, idx) => {
              const globalIdx = rowIdx * 3 + idx;
              return (
                <View key={globalIdx} style={styles.rectangleContainer}>
                  <TouchableOpacity
                    style={styles.rectangle}
                    onPress={() => handleRectanglePress(globalIdx)}
                  >
                    {images[globalIdx] ? (
                      <Image
                        source={{ uri: images[globalIdx] }}
                        style={styles.dashboardImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.rectangleText}>
                        {inputs[globalIdx] || "Dashboard"}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Button
                    title={images[globalIdx] ? "Change Image" : "Add Image"}
                    onPress={() => handlePickImage(globalIdx)}
                  />
                  <TextInput
                    style={styles.input}
                    value={inputs[globalIdx] || ""}
                    onChangeText={text => handleInputChange(text, globalIdx)}
                    placeholder="Enter dashboard name"
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dashboardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  rectangleText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: 100,
    height: 32,
    borderColor: "#ffffffff",
    borderWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginTop: 4,
  },
});