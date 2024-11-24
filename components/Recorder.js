import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Expo Linear Gradient
import Voice from '@react-native-community/voice';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Line } from 'react-native-svg'; // Include Line here

const { width } = Dimensions.get('window');

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // in seconds
  const [fileSize, setFileSize] = useState('0.0 MB');
  const [timer, setTimer] = useState(null);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      await Voice.start('en-US');
      console.log('Recording started');
      setIsRecording(true);
      setRecordingTime(0);
      setTimer(
        setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000)
      );
    } catch (error) {
      Alert.alert('Error', 'Could not start recording');
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      clearInterval(timer);
      setTimer(null);
      setFileSize((recordingTime * 0.01).toFixed(2) + ' MB'); // Example calculation
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording');
      console.error(error);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = () => console.log('Recording started');
    Voice.onSpeechEnd = () => console.log('Recording ended');

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <LinearGradient
      colors={['#2C5364', '#203A43', '#0F2027']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Icon name="menu" size={24} color="#fff" />
        <Text style={styles.title}>Voice Recorder</Text>
        <Icon name="close" size={24} color="#fff" />
      </View>

      <View style={styles.microphoneContainer}>
        <Svg height="150" width="150">
          <Circle
            cx="75"
            cy="75"
            r="70"
            stroke="#00FFB9"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
        <Icon name="mic" size={50} color="#00FFB9" style={styles.micIcon} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{formatTime(recordingTime)}</Text>
        <Text style={styles.infoText}>|</Text>
        <Text style={styles.infoText}>{fileSize}</Text>
      </View>

      <View style={styles.waveformContainer}>
        <Svg height="50" width={width - 40}>
          <Line
            x1="0"
            y1="25"
            x2={width - 40}
            y2="25"
            stroke="#FF8C00"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <TouchableOpacity
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  microphoneContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  micIcon: {
    position: 'absolute',
    top: 50,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 5,
  },
  waveformContainer: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  recordButton: {
    backgroundColor: '#00FFB9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  recordButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
