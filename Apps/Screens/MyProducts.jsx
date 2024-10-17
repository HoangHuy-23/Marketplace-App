import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import { useNavigation } from "@react-navigation/native";

export default function MyProducts() {
  const { user } = useUser();
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);

  const navigation = useNavigation();

  useEffect(() => {
    user && getUserPost();
  }, [user]);

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      user && getUserPost();
    });
  }, [navigation]);

  const getUserPost = async () => {
    setUserPost([]);
    setLoading(true);
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", user.primaryEmailAddress.emailAddress)
    );
    const querySnapshot = await getDocs(q);
    setLoading(false);
    querySnapshot.forEach((doc) => {
      setUserPost((prev) => [...prev, doc.data()]);
    });
  };
  return (
    <ScrollView className="bg-white">
      <LatestItemList
        latestItemList={userPost}
        heading={""}
        userProduct={true}
      />
    </ScrollView>
  );
}
