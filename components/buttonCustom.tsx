import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';

type ButtonCustomProps = {
  onPress: () => void;
  text: string;
  icon?: React.ReactNode;
  buttonStyle?: string;
  textStyle?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function ButtonCustom({
  text,
  onPress,
  icon,
  buttonStyle = 'bg-blue-600',
  textStyle = 'text-blue-600',
  loading,
  disabled = false,
}: ButtonCustomProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={`mb-4 flex-row items-center justify-center gap-2 rounded-lg py-4 ${buttonStyle}`}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {icon && icon}
          <Text className={`${textStyle}`}>{text}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
