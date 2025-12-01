import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';

export default function Upload() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ride' | 'run'>('ride');
  const [loading, setLoading] = useState(false);
  const { uploadActivity } = useActivityStore();
  const router = useRouter();

  const handleUpload = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter an activity name');
      return;
    }

    setLoading(true);
    try {
      await uploadActivity(name, type);
      Alert.alert('Success', 'Activity uploaded successfully!');
      setName('');
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-3xl font-bold mb-8">Upload Activity</Text>

      <Text className="text-gray-700 mb-2 font-medium">Activity Name</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
        placeholder="Morning Ride"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-gray-700 mb-3 font-medium">Activity Type</Text>
      <View className="flex-row mb-8">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg mr-2 border-2 ${
            type === 'ride' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
          }`}
          onPress={() => setType('ride')}
        >
          <Text
            className={`text-center font-semibold ${
              type === 'ride' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Ride
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-lg ml-2 border-2 ${
            type === 'run' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
          }`}
          onPress={() => setType('run')}
        >
          <Text
            className={`text-center font-semibold ${
              type === 'run' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Run
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-4 mb-4"
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-base">
            Choose File & Upload
          </Text>
        )}
      </TouchableOpacity>

      <Text className="text-gray-500 text-sm text-center mt-4">
        Supported formats: GPX, FIT, TCX
      </Text>
    </View>
  );
}
