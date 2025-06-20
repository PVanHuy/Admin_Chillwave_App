import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { User, CreateUserRequest, UpdateUserRequest } from "../models/User";

const COLLECTION_NAME = "users";

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTION_NAME))
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          displayName: data.username,
          phoneNumber: data.phone,
          photoURL: data.photoUrl,
          role: data.role,
          isActive: data.isActive,
          createdAt: data.created_at?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as User;
      });
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastLoginAt: data.lastLoginAt?.toDate(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  static async createUser(userData: CreateUserRequest): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...userData,
        phoneNumber: userData.phoneNumber || "",
        createdAt: now,
        updatedAt: now,
        favoriteArtists: [],
        favoriteSongs: [],
        favoriteAlbums: [],
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async updateUser(
    id: string,
    updates: UpdateUserRequest
  ): Promise<void> {
    try {
      const userRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("displayName", ">=", searchTerm),
          where("displayName", "<=", searchTerm + "\uf8ff"),
          limit(20)
        )
      );
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            lastLoginAt: doc.data().lastLoginAt?.toDate(),
          } as User)
      );
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }

  static async getActiveUsersCount(): Promise<number> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  static async getAdminCount(): Promise<number> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("role", "==", "admin")
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
