import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";

export default function AddPostScreen() {
  const db = getFirestore(app);

  const storage = getStorage(app);

  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 4],
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Categories"));

    querySnapshot.forEach((doc) => {
      console.log("Docs:", doc.data());
      setCategoryList((prev) => [...prev, doc.data()]);
    });
  };

  const onSubmitMethod = async (values) => {
    setLoading(true);
    values.image = selectedImage;
    if (!values.title) {
      ToastAndroid.show("Title must be required", ToastAndroid.SHORT);
      console.log("Title must be required");
      return;
    }
    if (!values.desc) {
      ToastAndroid.show("Description must be required", ToastAndroid.SHORT);
      console.log("Description must be required");
      return;
    }
    if (!values.price) {
      ToastAndroid.show("Price must be required", ToastAndroid.SHORT);
      console.log("Price must be required");
      return;
    }
    if (!values.address) {
      ToastAndroid.show("Address must be required", ToastAndroid.SHORT);
      console.log("Address must be required");
      return;
    }
    if (!values.category) {
      ToastAndroid.show("Category must be required", ToastAndroid.SHORT);
      console.log("Category must be required");
      return;
    }
    if (!values.image) {
      ToastAndroid.show("Image must be required", ToastAndroid.SHORT);
      console.log("Image must be required");
      return;
    }
    console.log("Values:", values);

    //convert uri to blob file
    const resp = await fetch(selectedImage);
    const blob = await resp.blob();

    //upload image to firebase storage
    const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");
    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
      })
      .then((resp) => {
        console.log("Image uploaded successfully");
        getDownloadURL(storageRef).then(async (url) => {
          console.log("URL:", url);
          values.image = url;
          values.userName = user.fullName;
          values.userEmail = user.primaryEmailAddress.emailAddress;
          values.userImage = user.imageUrl;
          const docRef = await addDoc(collection(db, "UserPost"), values);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("Post added successfully");
            console.log("Document written with ID: ", docRef.id);
          }
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10 bg-white">
        <Text className="text-[27px] font-bold">Add New Post</Text>
        <Text className="text-[16px] text-gray-500 mb-7">
          Create New Post and Start Selling
        </Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: moment(Date.now()).format("DD MMM YYYY"),
          }}
          onSubmit={(value) => onSubmitMethod(value)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImageAsync}>
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <Image
                    source={require("./../../assets/images/placeholder.jpg")}
                    style={{ width: 100, height: 100, objectFit: "contain" }}
                  />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              ></TextInput>
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              ></TextInput>
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              ></TextInput>
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={values?.address}
                onChangeText={handleChange("address")}
              ></TextInput>

              {/* Category list dropdown */}
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                <Picker
                  selectedValue={values?.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                  className="border-2"
                >
                  {categoryList &&
                    categoryList.map((category, index) => (
                      <Picker.Item
                        key={index}
                        label={category.name}
                        value={category.name}
                      />
                    ))}
                </Picker>
              </View>
              <TouchableOpacity
                onPress={handleSubmit}
                className={`p-5 bg-blue-500 rounded-full mt-10 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white text-center text-[16px]">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
              {/* <Button title="Submit" onPress={handleSubmit} className="mt-7" /> */}
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    paddingHorizontal: 17,
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
    textAlignVertical: "top",
  },
});
