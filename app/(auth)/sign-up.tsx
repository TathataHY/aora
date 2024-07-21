import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { CustomButton, FormField } from "@/components";
import { images } from "@/constants";
import { useGlobal } from "@/context/global-context";
import { registerUser } from "@/lib/appwrite";

export default function SignUpScreen() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { setUser, setIsLogged } = useGlobal();

  const handleSignUpSubmit = async () => {
    try {
      setSubmitting(true);

      if (form.username === "" || form.email === "" || form.password === "") {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const result = await registerUser(
        form.email,
        form.password,
        form.username
      );
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to Aora
          </Text>

          <FormField
            title="Username"
            otherStyles="mt-10"
            value={form.username}
            onChangeText={(e) => setForm({ ...form, username: e })}
            onSubmitEditing={() => emailInputRef.current?.focus()}
            returnKeyType="next"
          />

          <FormField
            ref={emailInputRef}
            title="Email"
            otherStyles="mt-7"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            keyboardType="email-address"
            returnKeyType="next"
          />

          <FormField
            ref={passwordInputRef}
            title="Password"
            otherStyles="mt-7"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            returnKeyType="done"
          />

          <CustomButton
            title="Sign Up"
            containerStyles="mt-7"
            onPress={handleSignUpSubmit}
            disabled={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
