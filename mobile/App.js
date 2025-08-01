import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const savedPapers = await AsyncStorage.getItem('papers');
      if (savedPapers) {
        setPapers(JSON.parse(savedPapers));
      }
    } catch (error) {
      console.error('Failed to load papers:', error);
    }
  };

  const createNewPaper = () => {
    navigation.navigate('Editor', { paperId: Date.now() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qmaker Mobile</Text>
      <TouchableOpacity style={styles.createButton} onPress={createNewPaper}>
        <Text style={styles.buttonText}>Create New Paper</Text>
      </TouchableOpacity>
      <ScrollView style={styles.papersList}>
        {papers.map(paper => (
          <TouchableOpacity 
            key={paper.id} 
            style={styles.paperItem}
            onPress={() => navigation.navigate('Editor', { paperId: paper.id })}
          >
            <Text style={styles.paperTitle}>{paper.title || 'Untitled Paper'}</Text>
            <Text style={styles.paperDate}>{new Date(paper.createdAt).toLocaleDateString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Editor Screen
const EditorScreen = ({ route, navigation }) => {
  const { paperId } = route.params;
  const [paper, setPaper] = useState({
    id: paperId,
    title: '',
    sections: [],
    createdAt: new Date().toISOString()
  });

  const savePaper = async () => {
    try {
      const papers = await AsyncStorage.getItem('papers');
      const papersList = papers ? JSON.parse(papers) : [];
      const existingIndex = papersList.findIndex(p => p.id === paperId);
      
      if (existingIndex >= 0) {
        papersList[existingIndex] = paper;
      } else {
        papersList.push(paper);
      }
      
      await AsyncStorage.setItem('papers', JSON.stringify(papersList));
    } catch (error) {
      console.error('Failed to save paper:', error);
    }
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${paper.sections.length + 1}`,
      questions: []
    };
    setPaper(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={savePaper}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.editor}>
        <Text style={styles.editorTitle}>Paper Editor</Text>
        <TouchableOpacity style={styles.addButton} onPress={addSection}>
          <Text style={styles.buttonText}>Add Section</Text>
        </TouchableOpacity>
        
        {paper.sections.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Qmaker' }}
        />
        <Stack.Screen 
          name="Editor" 
          component={EditorScreen} 
          options={{ title: 'Paper Editor' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  papersList: {
    flex: 1,
  },
  paperItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 10,
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paperDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    color: '#3b82f6',
    fontSize: 16,
  },
  saveButton: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editor: {
    flex: 1,
  },
  editorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  section: {
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});