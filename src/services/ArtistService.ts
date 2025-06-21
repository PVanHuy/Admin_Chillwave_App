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
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Artist,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../models/Artist";

const COLLECTION_NAME = "artists";

export class ArtistService {
  static async getAllArtists(): Promise<Artist[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTION_NAME))
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          artist_name: data.artist_name,
          bio: data.bio,
          artist_images: data.artist_images || "",
          love_count: data.love_count || 0,
        } as Artist;
      });
    } catch (error) {
      console.error("Error getting artists:", error);
      throw error;
    }
  }

  static async getArtistById(id: string): Promise<Artist | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          artist_name: data.artist_name,
          bio: data.bio,
          artist_images: data.artist_images || "",
          love_count: data.love_count || 0,
        } as Artist;
      }
      return null;
    } catch (error) {
      console.error("Error getting artist:", error);
      throw error;
    }
  }

  static async createArtist(artistData: CreateArtistRequest): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...artistData,
        love_count: 0,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating artist:", error);
      throw error;
    }
  }

  static async updateArtist(
    id: string,
    updates: UpdateArtistRequest
  ): Promise<void> {
    try {
      const artistRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(artistRef, {
        ...updates,
      });
    } catch (error) {
      console.error("Error updating artist:", error);
      throw error;
    }
  }

  static async deleteArtist(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting artist:", error);
      throw error;
    }
  }

  static async searchArtists(searchTerm: string): Promise<Artist[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("artist_name", ">=", searchTerm),
          where("artist_name", "<=", searchTerm + "\uf8ff"),
          limit(20)
        )
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          artist_name: data.artist_name,
          bio: data.bio,
          artist_images: data.artist_images || "",
          love_count: data.love_count || 0,
        } as Artist;
      });
    } catch (error) {
      console.error("Error searching artists:", error);
      throw error;
    }
  }
}
