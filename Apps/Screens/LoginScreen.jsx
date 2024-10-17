import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPess = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
      }
    } catch (error) {
      console.error("OAuth error", error);
    }
  }, []);
  return (
    <View>
      <Image
        source={require("./../../assets/images/login.jpeg")}
        className="w-full h-[400px] object-cover"
      />
      <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md">
        <Text className="text-[30px] font-bold">Community Marketplace</Text>
        <Text className="text-[18px] text-slate-500 mt-6">
          Buy Sell Marketplace where you can sell old item and make real money
        </Text>
        <TouchableOpacity
          onPress={() => {
            onPess();
            console.log("sign in");
          }}
          className="p-3 bg-blue-500 rounded-full mt-20"
        >
          <Text className="text-white text-center text-[18px]">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
