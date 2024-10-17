import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Button,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function ProductDetail({ navigation }) {
  const { params } = useRoute();

  const [product, setProduct] = useState({});

  const { user } = useUser();

  const db = getFirestore(app);

  const nav = useNavigation();

  useEffect(() => {
    console.log("ProductDetail:", params);
    params && setProduct(params.product);
    shareButton();
  }, [params, navigation]);

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="share-social-sharp"
          size={24}
          color="white"
          style={{ marginRight: 15 }}
          onPress={() => shareProduct()}
        />
      ),
    });
  };

  //   used to share product
  const shareProduct = () => {
    const content = {
      message: product?.title + "\n" + product?.desc,
    };
    Share.share(content).then(
      (res) => {
        console.log("Share Result:", res);
      },
      (error) => {
        console.log("Share Error:", error);
      }
    );
  };

  const sendEmailMessage = () => {
    console.log("Send Email Message");
    const subject = "Regarding " + product.title;
    const body =
      "Hi " +
      product.userName +
      ",\n I am interested in your product " +
      product.title;
    Linking.openURL(
      `mailto:${product.userEmail}?subject=${subject}&body=${body}`
    );
  };

  const deleteUserPost = () => {
    Alert.alert(
      "Do you want to delete this post?",
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: () => {
            deleteFromFirebase();
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  };

  const deleteFromFirebase = async () => {
    const q = query(
      collection(db, "UserPost"),
      where("title", "==", product.title)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref).then((resp) => {
        nav.goBack();
      });
    });
  };

  return (
    <ScrollView className="bg-white">
      <Image source={{ uri: product.image }} className="h-[350px] w-full" />
      <View className="p-2">
        <Text className="text-[24px] font-bold">{product.title}</Text>
        <Text className="text-blue-500 bg-blue-200 p-[2px] rounded-full px-1 text-[10px] w-[70px] text-center mt-1">
          {product.category}
        </Text>
        <Text className="mt-3 font-bold text-[20px]">Description</Text>
        <Text className="text-[17px] text-gray-500">{product.desc}</Text>
        {/* <Text className="text-[20px] font-bold text-blue-500">
          $ {product.price}
        </Text> */}
      </View>
      {/* user info */}
      <View className="p-2 flex flex-row items-center gap-3 bg-blue-50 border-gray-400">
        <Image
          source={{ uri: product.userImage }}
          className="w-12 h-12 rounded-full"
        />
        <View className="">
          <Text className="font-bold text-[18px]">{product.userName}</Text>
          <Text className="text-gray-500">{product.userEmail}</Text>
        </View>
      </View>

      {user?.primaryEmailAddress.emailAddress === product.userEmail ? (
        <TouchableOpacity
          onPress={() => deleteUserPost()}
          className="z-40 bg-red-500 p-4 m-2 rounded-full"
        >
          <Text className="text-center text-white">Delete Post</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendEmailMessage()}
          className="z-40 bg-blue-500 p-4 m-2 rounded-full"
        >
          <Text className="text-center text-white">Send Message</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
