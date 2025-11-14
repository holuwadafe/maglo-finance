import { account, ID } from "@/lib/appwrite";
import { Models } from "appwrite";

export const authService = {
  async signup(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name);
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<Models.User<Models.Preferences>> {
    try {
      return await account.get();
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },
};
