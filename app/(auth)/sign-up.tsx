import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import ButtonCustom from 'components/buttonCustom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Success', 'Account created! Please check your email to verify.');
      router.replace('/(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Text className="mb-8 text-center text-3xl font-bold">Sign Up</Text>

      <TextInput
        className="mb-4 rounded-lg border border-gray-300 px-4 py-3 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="mb-4 rounded-lg border border-gray-300 px-4 py-3 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="mb-6 rounded-lg border border-gray-300 px-4 py-3 text-base"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <ButtonCustom
        onPress={handleSignUp}
        textStyle="text-center text-base font-semibold text-white"
        text={'Sign Up'}
        loading={loading}
      />

      <TouchableOpacity className="py-3" onPress={() => router.back()}>
        <Text className="text-center text-blue-600">Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
