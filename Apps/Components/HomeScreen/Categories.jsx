import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Categories({ categoryList }) {
  const navigation = useNavigation();
  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">Categories</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate("item-list", {
                category: item?.name,
              })
            }
            className="flex-1 items-center justify-center p-2 border-[1px] border-blue-300 m-1 h-[80px] rounded-lg bg-blue-50"
          >
            <Image
              source={{ uri: item?.icon }}
              className="h-[35px] w-[35px] "
            />
            <Text className="text-[12px] mt-1">{item?.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
