import React from 'react';
import { View, Text } from 'react-native';
import { ActivityType } from 'utils/types';
import { Bike, Footprints } from 'lucide-react-native';

type ChipProps = {
  type: ActivityType;
};

export default function Chip({ type }: ChipProps) {
  return (
    <View
      className={`flex-row items-center gap-2 rounded-full px-3 py-1 ${type === 'ride' ? 'bg-blue-100' : 'bg-green-100'}`}>
      {type === 'ride' ? (
        <Bike size={16} color={'#3b82f6'} />
      ) : (
        <Footprints size={16} color={'#16a34a'} />
      )}
      <Text
        className={`text-xs font-medium uppercase ${type === 'ride' ? 'text-blue-600' : 'text-green-600'} `}>
        {type}
      </Text>
    </View>
  );
}
