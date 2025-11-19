import { Category } from '@/type';
import cn from 'clsx';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Platform, Text, TouchableOpacity } from 'react-native';

interface FilterProps {
  categories: Category[];
}

const Filter = ({ categories }: FilterProps) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || 'all');

  const filterData: (Category | { $id: string; name: string })[] = 
    categories 
      ? [{ $id: 'all', name: 'All' }, ...categories] 
      : [{ $id: 'all', name: 'All' }];

  const handlePress = (id: string) => {
    setActive(id);
    if(id === 'all') {
      router.setParams({ category: undefined })
    } else {
      router.setParams({ category: id })
    }
  }
  return (
    <FlatList 
      data={filterData}
      keyExtractor={item => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          onPress={() => handlePress(item.$id)}
          style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}
          className={cn(
            'filter',
            active === item.$id ? 'bg-amber-500' : 'bg-white'
          )}
        >
          <Text className={cn(
            'body-medium',
            active === item.$id ? 'text-white' : 'text-dark-100'
          )}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  )
}

export default Filter