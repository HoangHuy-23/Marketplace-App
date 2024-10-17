import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import notebook from "../../assets/images/check-list.png";
import connect from "../../assets/images/link.png";
import logout from "../../assets/images/logout.png";
import research from "../../assets/images/product-research.png";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const navigation = useNavigation();

  const menuList = [
    {
      id: 1,
      name: "My Products",
      icon: notebook,
      path: "my-products",
    },
    {
      id: 2,
      name: "Explore",
      icon: research,
      path: "explore",
    },
    {
      id: 3,
      name: "Connect",
      icon: connect,
      url: "",
    },
    {
      id: 4,
      name: "Logout",
      icon: logout,
    },
  ];

  const onMenuPress = (item) => {
    if (item.name === "Logout") {
      signOut();
      return;
    }
    item?.path ? navigation.navigate(item.path) : null;
  };
  return (
    <View className="p-5 bg-white flex-1">
      <View className="items-center mt-14">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-[100px] h-[100px] rounded-full"
        />
        <Text className="text-[25px] font-bold mt-2">{user?.fullName}</Text>
        <Text className="text-[18px] text-gray-500 mt-2">
          {user?.primaryEmailAddress.emailAddress}
        </Text>
      </View>
      <FlatList
        data={menuList}
        numColumns={3}
        style={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onMenuPress(item)}
            className="flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-md border-blue-400 bg-blue-50"
          >
            {item.icon && (
              <Image source={item.icon} className="w-[50px] h-[50px]" />
            )}
            <Text className="text-[12px] text-blue-700 ml-2">{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
