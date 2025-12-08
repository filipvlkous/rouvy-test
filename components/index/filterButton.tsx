import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type FilterButtonProps = {
  selectedFilter: string;
  filter: string;
  handleFilterChange: (newFilter: string) => void;
};

export default function FilterButton({
  selectedFilter,
  filter,
  handleFilterChange,
}: FilterButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => handleFilterChange(filter.toLowerCase())}
      className={`rounded-lg px-4 py-2 ${selectedFilter === filter.toLowerCase() ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <Text
        className={`font-semibold ${selectedFilter === filter.toLowerCase() ? 'text-white' : 'text-gray-700'}`}>
        {filter}
      </Text>
    </TouchableOpacity>
  );
}
