import { router, usePathname } from "expo-router";
import { useState } from "react";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";

export function SearchInput({ initialQuery }: { initialQuery?: string }) {
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
        className="flex-1 text-white font-pregular text-base mt-0.5"
        keyboardType="web-search"
        returnKeyType="search"
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "") {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }

          try {
            if (pathname.startsWith("/search")) {
              router.setParams({ query });
            } else {
              router.push(`/search/${query}`);
            }
          } finally {
            setQuery("");
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
