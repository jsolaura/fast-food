import { CreateUserPrams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.jsolaura.fastfood",
  databaseId: "691bfcb6003336830096",
  userCollectionId: "user",
}

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const account = new Account(client);

export const database = new Databases(client);

const avatars = new Avatars(client);

export const createUser = async ({ 
  email, 
  password, 
  name
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if(!newAccount) throw new Error('Failed to create account');

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email,
        name,
        accountId: newAccount.$id,
        avatar: avatarUrl,
      }
    )

  } catch (error: any) {
    throw new Error(error);
  }
}

export const signIn = async ({ email, password }: Omit<CreateUserPrams, 'name'>) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if(!session) throw new Error('Failed to sign in');

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw new Error('Failed to get current user');

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if(!currentUser) throw new Error('Failed to get current user');

    return currentUser.documents[0];
  } catch (error: any) {
    throw new Error(error);
  }
}