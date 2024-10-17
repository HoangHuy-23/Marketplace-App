import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import {
  collection,
  getDocs,
  getFirestore,
  or,
  orderBy,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../Components/HomeScreen/Categories";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);
  // used get silder list
  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      setSliderList((prev) => [...prev, doc.data()]);
    });
  };

  // used get categories list
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Categories"));

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setCategoryList((prev) => [...prev, doc.data()]);
    });
  };

  // used get latest item list
  const getLatestItemList = async () => {
    setLatestItemList([]);
    const querySnapshot = await getDocs(
      collection(db, "UserPost"),
      orderBy("createdAt", "desc")
    );

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setLatestItemList((prev) => [...prev, doc.data()]);
    });
  };
  return (
    <ScrollView className="py-8 px-6 bg-white flex-1">
      <Header />
      {/* Slider */}
      <Slider sliderList={sliderList} />
      {/* categories */}
      <Categories categoryList={categoryList} />
      {/* latest item list */}
      <LatestItemList
        latestItemList={latestItemList}
        heading={"Latest Items"}
      />
    </ScrollView>
  );
}
