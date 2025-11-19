import { images } from '@/constants';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text);

    if(!text) router.setParams({ query: undefined });
  }

  const handleSubmit = () => {
    if(query?.trim()) router.setParams({ query });
  }

  const handleReset = () => {
    setQuery('');
    router.setParams({ query: undefined, category: undefined });
  }
  return (
    <View className="searchbar">
      <TextInput 
        className="flex-1 p-5"
        placeholder="Search for Pizzas, burgers..."
        placeholderTextColor="#A0A0A0"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <View className="flex-row items-center gap-3 pr-5">
        <TouchableOpacity onPress={handleSubmit}>
          <Image 
            source={images.search} 
            className="size-6" 
            resizeMode="contain"
            tintColor="#5D5F6D"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset}>
          <Image 
            source={images.reset} 
            className="size-6" 
            resizeMode="contain"
            tintColor="#5D5F6D"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchBar