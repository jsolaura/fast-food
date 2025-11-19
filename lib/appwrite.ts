import { CreateUserPrams, GetMenuParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.jsolaura.fastfood",
  databaseId: "691bfcb6003336830096",
  bucketId: "691c2022001615707d90",
  userCollectionId: "user",
  categoriesCollectionId: "categories",
  menuCollectionId: "menu",
  customizationsCollectionId: "customizations",
  menuCustomizationsCollectionId: "menu_customizations",
}

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

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

    return await databases.createDocument(
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

    const currentUser = await databases.listDocuments(
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

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if(category) queries.push(Query.equal('categories', category));
    if(query) queries.push(Query.search('name', query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;

  } catch (error: any) {
    throw new Error(error);
  }
}

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );

    return categories.documents;

  } catch (error: any) {
    throw new Error(error);
  }
}