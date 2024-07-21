import type { Models } from "react-native-appwrite";

export interface User  extends Models.Document {
  username: string;
  email: string;
  avatar: string;
  accountId: string;
}
