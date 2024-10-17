import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function ExploreScreen() {
  const db = getFirestore(app);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  // used get all products
  const getAllProducts = async () => {
    setProductList([]);
    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setProductList((productList) => [...productList, doc.data()]);
    });
  };
  return (
    <ScrollView className="p-5 py-8">
      <Text className="text-[30px] font-bold">Explore More</Text>
      <LatestItemList latestItemList={productList} heading={""} />
    </ScrollView>
  );
}
