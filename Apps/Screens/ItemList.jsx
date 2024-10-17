import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function ItemList() {
  const { params } = useRoute();
  const db = getFirestore(app);

  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Category:", params.category);
    params && getItemListByCategory();
  }, [params]);

  const getItemListByCategory = async () => {
    setItemList([]);
    setLoading(true);
    const q = query(
      collection(db, "UserPost"),
      where("category", "==", params.category)
    );

    const querySnapshot = await getDocs(q);
    setLoading(false);
    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setItemList((prev) => [...prev, doc.data()]);
      setLoading(false);
    });
  };

  return (
    <View className="p-2">
      {loading ? (
        <ActivityIndicator className="mt-24" size="large" color="#0000ff" />
      ) : itemList?.length > 0 ? (
        <LatestItemList latestItemList={itemList} heading={"Latest Post"} />
      ) : (
        <Text className="text-center text-[20px] mt-24 text-gray-400">
          No Post Found
        </Text>
      )}
    </View>
  );
}
