import { router, usePathname } from "expo-router";
import { Image, Text, View } from "react-native";

import { images } from "@/constants";
import { CustomButton } from "./custom-button";

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const pathname = usePathname();
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[216px]"
        resizeMode="contain"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      {pathname !== "/home" && (
        <CustomButton
          title="Back to Explore"
          containerStyles="w-full my-5"
          onPress={() => router.push("/home")}
        />
      )}
    </View>
  );
}
