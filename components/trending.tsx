import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  type ViewToken,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { icons } from "@/constants";
import { Post } from "@/types/post";

export function Trending({ posts }: { posts: Post[] }) {
  const [activePost, setActivePost] = useState<any>(posts[0]);

  const handleItemsChangedViewable = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Post>[];
  }) => {
    if (viewableItems.length > 0) {
      setActivePost(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(post) => post.$id}
      renderItem={({ item: post }) => (
        <TrendingItem post={post} activePost={activePost} />
      )}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      onViewableItemsChanged={handleItemsChangedViewable}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
}

const zoomIn = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1 }] },
};

const zoomOut = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};

// Registro de animaciones personalizadas
Animatable.initializeRegistryWithDefinitions({
  zoomIn,
  zoomOut,
});

const TrendingItem = ({
  post,
  activePost,
}: {
  post: Post;
  activePost: any;
}) => {
  const [played, setPlayed] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activePost === post.$id ? "zoomIn" : "zoomOut"}
      duration={500}
    >
      {played ? (
        <Video
          source={{ uri: post.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlayed(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlayed(true)}
        >
          <ImageBackground
            source={{
              uri: post.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
