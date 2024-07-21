import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, SearchInput, VideoCard } from "@/components";
import useAppwrite from "@/hooks/use-appwrite";
import { searchPosts } from "@/lib/appwrite";

export default function SearchScreen() {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(query as string)
  );

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard {...item} />}
        ListHeaderComponent={
          <View className="flex my-6 px-4">
            <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white mt-1">
              {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query as string} />
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        }
      />
    </SafeAreaView>
  );
}
