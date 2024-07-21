import * as DocumentPicker from "expo-document-picker";
import type { Models } from "react-native-appwrite";

import type { User } from "./user";

export interface Post extends Models.Document {
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  creator: User;
}

export interface CreatePost {
  title: string;
  thumbnail: DocumentPicker.DocumentPickerAsset | null;
  prompt: string;
  video: DocumentPicker.DocumentPickerAsset | null;
  userId?: string;
}
