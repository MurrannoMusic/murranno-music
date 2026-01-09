/**
 * Image Picker Component
 * For selecting cover art and profile photos
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme';

interface ImagePickerButtonProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string | null;
  placeholder?: string;
  aspectRatio?: [number, number];
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle';
  loading?: boolean;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImageSelected,
  currentImage,
  placeholder = '🖼️',
  aspectRatio = [1, 1],
  size = 'large',
  shape = 'square',
  loading = false,
}) => {
  const [localUri, setLocalUri] = useState<string | null>(null);

  const displayUri = localUri || currentImage;

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'medium':
        return { width: 120, height: 120 };
      case 'large':
        return { width: 200, height: 200 };
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      onImageSelected(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalUri(uri);
      onImageSelected(uri);
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getSizeStyle(),
        shape === 'circle' && styles.circle,
      ]}
      onPress={showOptions}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : displayUri ? (
        <Image
          source={{ uri: displayUri }}
          style={[
            styles.image,
            getSizeStyle(),
            shape === 'circle' && styles.circle,
          ]}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>{placeholder}</Text>
          <Text style={styles.placeholderText}>Tap to upload</Text>
        </View>
      )}

      {displayUri && (
        <View style={styles.editBadge}>
          <Text style={styles.editIcon}>✏️</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circle: {
    borderRadius: 9999,
  },
  image: {
    borderRadius: 20,
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 14,
  },
});

export default ImagePickerButton;
