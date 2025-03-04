import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {DrawingToolsData} from 'data/data';
import {color} from 'theme/color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const DrawingTools = ({
  handleClear,
  selectedMode,
  setSelectedMode,
  selectedTool,
  setSelectedTool,
  selectedStyle,
  setSelectedStyle,
  selectedColor,
  setSelectedColor,
  strokeWidth,
  setStrokeWidth,
  setSelectedShape,
  selectedShape,
}) => {
  const tools = DrawingToolsData.drawStyle;
  const drawWidth = DrawingToolsData.size;
  const lineStyle = DrawingToolsData.lineStyle;
  const colors = DrawingToolsData.drawColor;
  const actionsIcons = DrawingToolsData.otherTools;
  const shapes = [
    {id: 'circle', icon: 'circle-outline'},
    {id: 'rect', icon: 'rectangle-outline'},
    {id: 'triangle', icon: 'triangle-outline'},
  ];
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          {width: '100%', justifyContent: 'center'},
          selectedMode == actionsIcons[0].id && styles.selectedTool,
        ]}
        onPress={() => setSelectedMode(actionsIcons[0].id)}>
        <Image style={styles.image} source={actionsIcons[0].image} />
        <Text style={styles.toolText}>Move</Text>
      </TouchableOpacity>
      <View style={styles.toolsContainer}>
        {tools.map(tool => (
          <TouchableOpacity
            onPress={() => {
              setSelectedMode('draw');
              setSelectedTool(tool.id);
              setSelectedStyle('normal');
            }}
            key={tool.id}
            style={[
              styles.toolButton,
              selectedTool == tool.id &&
                selectedMode === 'draw' &&
                styles.selectedTool,
            ]}>
            <Image source={tool.image} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.toolsContainer}>
        {drawWidth.map(tool => (
          <TouchableOpacity
            onPress={() => setStrokeWidth(tool.id)}
            key={tool.id}
            style={[
              styles.toolButton,
              strokeWidth == tool.id &&
                selectedMode === 'draw' &&
                styles.selectedTool,
            ]}>
            <Image source={tool.image} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.toolsContainer}>
        {selectedTool === 'curve' &&
          lineStyle.map(
            tool =>
              tool.id !== 'zigzag' &&
              tool.id !== 'arrowDouble' && (
                <TouchableOpacity
                  onPress={() => setSelectedStyle(tool.id)}
                  key={tool.id}
                  style={[
                    styles.toolButton,
                    selectedStyle == tool.id &&
                      selectedMode === 'draw' &&
                      styles.selectedTool,
                  ]}>
                  <Image source={tool.image} />
                </TouchableOpacity>
              ),
          )}
        {selectedTool === 'line' &&
          lineStyle.map(tool => (
            <TouchableOpacity
              onPress={() => setSelectedStyle(tool.id)}
              key={tool.id}
              style={[
                styles.toolButton,
                selectedStyle == tool.id &&
                  selectedMode === 'draw' &&
                  styles.selectedTool,
              ]}>
              <Image source={tool.image} />
            </TouchableOpacity>
          ))}
        {selectedTool === 'shape' &&
          shapes.map(tool => (
            <TouchableOpacity
              onPress={() => setSelectedShape(tool.id)}
              key={tool.id}
              style={[
                styles.toolButton,
                selectedShape == tool.id &&
                  selectedMode === 'draw' &&
                  styles.selectedTool,
              ]}>
              <Icon name={tool.icon} size={20} color="#fff" />
            </TouchableOpacity>
          ))}
      </View>
      <View style={styles.colorContainer}>
        {colors.map(tool => (
          <TouchableOpacity
            onPress={() => setSelectedColor(tool.color)}
            key={tool.id}
            style={[
              styles.colorButton,
              {backgroundColor: tool.color},
              selectedColor == tool.color &&
                selectedMode === 'draw' &&
                styles.selectedTool,
            ]}></TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          marginVertical: 6,
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={() => setSelectedMode(actionsIcons[1].id)}
          style={[
            styles.actionButton,
            selectedMode === actionsIcons[1].id && styles.selectedTool,
          ]}>
          <Image style={styles.image} source={actionsIcons[1].image} />
          <Text style={styles.toolText}>Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleClear()}
          style={styles.actionButton}>
          <Image style={styles.image} source={actionsIcons[2].image} />
          <Text style={styles.toolText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    marginTop: 15,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  toolButton: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    backgroundColor: color.black,
    marginHorizontal: 2,
    display: 'flex',
    maxHeight: 40,
    maxWidth: 40,
    minWidth: 20,
    minHeight: 20,
  },
  selectedTool: {
    borderColor: color.blue,
    borderWidth: 2,
  },
  toolText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
  },
  colorButton: {
    width: 18,
    height: 18,
    borderColor: '#fff',
    borderWidth: 1,
    marginHorizontal: 2,
  },
  image: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 5,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: color.black,
    paddingVertical: 10,
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginBottom: 8,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default DrawingTools;
