import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);

export { ID };

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const INVOICES_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID || "";
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "";

