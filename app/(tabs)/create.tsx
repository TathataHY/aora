import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "@/components";
import { icons } from "@/constants";
import { useGlobal } from "@/context/global-context";
import { createVideoPost } from "@/lib/appwrite";
import { CreatePost } from "@/types/post";

const DEFAULT_PROPS: CreatePost = {
  title: "",
  thumbnail: null,
  prompt: "",
  video: null,
};

export default function CreateScreen() {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<CreatePost>(DEFAULT_PROPS);

  const { user } = useGlobal();

  const handleOpenPickerPress = async (selectType: "image" | "video") => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    }
    //  else {
    //   setTimeout(() => {
    //     Alert.alert("Document picked", JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };

  const handleCreatePostSubmit = async () => {
    try {
      setUploading(true);
      if (
        form.prompt === "" ||
        form.title === "" ||
        !form.thumbnail ||
        !form.video
      ) {
        return Alert.alert("Error", "Please provide all fields");
      }

      await createVideoPost({
        ...form,
        userId: user!.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setForm(DEFAULT_PROPS);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          otherStyles="mt-10"
          value={form.title}
          placeholder="Give your video a catchy title..."
          onChangeText={(e) => setForm({ ...form, title: e })}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => handleOpenPickerPress("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
                useNativeControls
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                    alt="upload"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => handleOpenPickerPress("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          otherStyles="mt-7"
          value={form.prompt}
          onChangeText={(e) => setForm({ ...form, prompt: e })}
          placeholder="The AI prompt of your video...."
        />

        <CustomButton
          title="Submit & Publish"
          containerStyles="mt-7"
          onPress={handleCreatePostSubmit}
          disabled={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
