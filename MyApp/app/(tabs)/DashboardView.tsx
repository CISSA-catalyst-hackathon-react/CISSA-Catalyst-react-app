// app/(tabs)/dashboard.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Tool =
  | 'select'
  | 'pan'
  | 'addPost'
  | 'addLink'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'settings';

export default function DashboardScreen() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(1);
  const [postCount, setPostCount] = useState(3);

  // Mock handlers (no graph yet)
  const handleTool = (tool: Tool) => {
    setActiveTool(tool);
    if (tool === 'zoomIn') setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)));
    if (tool === 'zoomOut') setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)));
    if (tool === 'addPost') setPostCount(n => n + 1);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* TOP TOOLBAR */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>zoom {Math.round(zoom * 100)}% • posts {postCount}</Text>
        </View>

        <View style={styles.topActions}>
          <Link href="/(tabs)/landPage" asChild>
            <TouchableOpacity style={styles.topBtn}>
              <Ionicons name="arrow-back" size={20} color="#111827" />
              <Text style={styles.topBtnText}>Back</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => Alert.alert('Create Post', `You created ${postCount + 1}-th post`)}
          >
            <Ionicons name="add-circle" size={20} color="#4f46e5" />
            <Text style={styles.topBtnText}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT AREA (your graph/canvas would live here) */}
      <View style={styles.canvas}>
        <Text style={{ color: '#9ca3af' }}>
          Canvas / Graph goes here. Active tool: {activeTool}
        </Text>
      </View>

      {/* RIGHT SIDEBAR */}
      <View style={styles.rightBar}>
        <ToolButton
          icon={<Ionicons name="hand-left-outline" size={20} color="#111827" />}
          label="Select"
          active={activeTool === 'select'}
          onPress={() => handleTool('select')}
        />
        <ToolButton
          icon={<MaterialCommunityIcons name="hand-back-right-outline" size={20} color="#111827" />}
          label="Pan"
          active={activeTool === 'pan'}
          onPress={() => handleTool('pan')}
        />
        <ToolButton
          icon={<Ionicons name="add" size={20} color="#111827" />}
          label="Add Post"
          active={activeTool === 'addPost'}
          onPress={() => handleTool('addPost')}
        />
        <ToolButton
          icon={<MaterialCommunityIcons name="vector-line" size={20} color="#111827" />}
          label="Link"
          active={activeTool === 'addLink'}
          onPress={() => handleTool('addLink')}
        />
        <ToolButton
          icon={<Ionicons name="arrow-undo-outline" size={20} color="#111827" />}
          label="Undo"
          active={activeTool === 'undo'}
          onPress={() => handleTool('undo')}
        />
        <ToolButton
          icon={<Ionicons name="arrow-redo-outline" size={20} color="#111827" />}
          label="Redo"
          active={activeTool === 'redo'}
          onPress={() => handleTool('redo')}
        />
        <ToolButton
          icon={<Ionicons name="add-circle-outline" size={20} color="#111827" />}
          label="Zoom In"
          active={activeTool === 'zoomIn'}
          onPress={() => handleTool('zoomIn')}
        />
        <ToolButton
          icon={<Ionicons name="remove-circle-outline" size={20} color="#111827" />}
          label="Zoom Out"
          active={activeTool === 'zoomOut'}
          onPress={() => handleTool('zoomOut')}
        />
        <ToolButton
          icon={<Ionicons name="settings-outline" size={20} color="#111827" />}
          label="Settings"
          active={activeTool === 'settings'}
          onPress={() => handleTool('settings')}
        />
      </View>
    </SafeAreaView>
  );
}

function ToolButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toolBtn, active && styles.toolBtnActive]}
    >
      <View style={styles.toolIcon}>{icon}</View>
      <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f4f6' },

  // Top toolbar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  topLeft: { gap: 2 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6b7280' },
  topActions: { flexDirection: 'row', gap: 8 },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef2ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  topBtnText: { color: '#111827', fontWeight: '600' },

  // Canvas placeholder
  canvas: {
    flex: 1,
    margin: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  // Right sidebar
  rightBar: {
    position: 'absolute',
    right: 10,
    top: 70,
    bottom: 20,
    width: 110,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#ffffffee',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  toolBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  toolBtnActive: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  toolIcon: { marginBottom: 4 },
  toolLabel: { fontSize: 11, color: '#111827', textAlign: 'center' },
});
