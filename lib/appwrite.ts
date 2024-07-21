import {
  EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_APPWRITE_STORAGE_ID,
  EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
} from "@env";

import * as DocumentPicker from "expo-document-picker";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

import type { CreatePost, Post } from "@/types/post";
import type { User } from "@/types/user";

export const appwriteConfig = {
  projectId: EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageId: EXPO_PUBLIC_APPWRITE_STORAGE_ID,
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.oneup-i.aora",
  userCollectionId: EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: EXPO_PUBLIC_APPWRITE_VIDEO_COLLECTION_ID,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const registerUser = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const avatarURL = avatars.getInitials(username);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarURL,
      }
    );

    await signIn(email, password);

    return newUser as User;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0] as User;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );
    return posts.documents as Post[];
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const getLatestPosts = async (): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents as Post[];
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );
    if (!posts) throw new Error("Something went wrong");
    return posts.documents as Post[];
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents as Post[];
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export const createVideoPost = async (form: CreatePost): Promise<Post> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail!, "image"),
      uploadFile(form.video!, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost as Post;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
};

export async function uploadFile(
  file: DocumentPicker.DocumentPickerAsset,
  type: string
) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      {
        name: asset.name,
        type: asset.type!,
        size: asset.size!,
        uri: asset.uri!,
      }
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
}

export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  } finally {
  }
}
