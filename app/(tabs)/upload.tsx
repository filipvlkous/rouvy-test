import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useActivityStore } from '../../store/activityStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bike,
  Footprints,
  Upload as UploadIcon,
  FileText,
  X,
  AlertCircle,
} from 'lucide-react-native';
import { handleUpload } from 'services/upload';

export default function Upload() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ride' | 'run'>('ride');
  const [loading, setLoading] = useState(false);
  const { uploadActivity, uploading, error, clearError } = useActivityStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom }}
      className="flex-1 bg-gray-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View className="px-6 pb-4">
            <Text className="text-3xl font-bold">Upload Activity</Text>
          </View>

          <View className="px-6">
            {error && (
              <View className="mb-3 flex-row items-start rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle size={20} color="#dc2626" style={{ marginTop: 2 }} />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-semibold text-red-900">Upload Failed</Text>
                  <Text className="mt-1 text-sm text-red-700">{error}</Text>
                </View>
                <TouchableOpacity onPress={clearError} className="ml-2">
                  <X size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>
            )}

            <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
              <Text className="mb-2 text-xs text-gray-500">Activity Name</Text>
              <TextInput
                className="text-base font-semibold text-gray-900"
                placeholder="Morning Ride"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-3">
              <Text className="mb-3 text-xs text-gray-500">Activity Type</Text>
              <View className="flex-row">
                <TouchableOpacity
                  className={`mr-2 flex-1 rounded-lg border py-4 ${
                    type === 'ride' ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setType('ride')}>
                  <View className="items-center">
                    <Bike size={24} color={type === 'ride' ? '#ffffff' : '#2563eb'} />
                    <Text
                      className={`mt-2 font-semibold ${
                        type === 'ride' ? 'text-white' : 'text-gray-700'
                      }`}>
                      Ride
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`ml-2 flex-1 rounded-lg border py-4 ${
                    type === 'run' ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setType('run')}>
                  <View className="items-center">
                    <Footprints size={24} color={type === 'run' ? '#ffffff' : '#2563eb'} />
                    <Text
                      className={`mt-2 font-semibold ${
                        type === 'run' ? 'text-white' : 'text-gray-700'
                      }`}>
                      Run
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`mb-3 flex-row items-center justify-center rounded-lg py-4 ${
                uploading || loading ? 'bg-blue-400' : 'bg-blue-600'
              }`}
              onPress={() =>
                handleUpload({ name, type, setLoading, uploadActivity, setName, router })
              }
              disabled={uploading || loading}>
              {uploading || loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <UploadIcon size={18} color="white" />
                  <Text className="ml-2 text-center text-base font-semibold text-white">
                    Choose File & Upload
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View className="rounded-lg border border-gray-200 bg-white p-4">
              <View className="flex-row items-center">
                <FileText size={16} color="#6b7280" />
                <Text className="ml-2 text-xs text-gray-500">Supported formats</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold text-gray-700">GPX</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
