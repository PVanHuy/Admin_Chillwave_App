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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Album, CreateAlbumRequest, UpdateAlbumRequest } from "../models/Album";

const COLLECTION_NAME = "albums";

export class AlbumService {
  static async getAllAlbums(): Promise<Album[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          album_name: data.album_name,
          artist_id: data.artist_id,
          album_imageUrl: data.album_imageUrl,
          songs_id: data.songs_id || [],
        } as Album;
      });
    } catch (error) {
      console.error("Error getting albums:", error);
      throw error;
    }
  }

  static async getAlbumById(id: string): Promise<Album | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          album_name: data.album_name,
          artist_id: data.artist_id,
          album_imageUrl: data.album_imageUrl,
          songs_id: data.songs_id || [],
        } as Album;
      }
      return null;
    } catch (error) {
      console.error("Error getting album:", error);
      throw error;
    }
  }

  static async createAlbum(albumData: CreateAlbumRequest): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), albumData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating album:", error);
      throw error;
    }
  }

  static async updateAlbum(
    id: string,
    updates: UpdateAlbumRequest
  ): Promise<void> {
    try {
      const albumRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(albumRef, { ...updates });
    } catch (error) {
      console.error("Error updating album:", error);
      throw error;
    }
  }

  static async deleteAlbum(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting album:", error);
      throw error;
    }
  }

  static async searchAlbums(searchTerm: string): Promise<Album[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("album_name", ">=", searchTerm),
          where("album_name", "<=", searchTerm + "\uf8ff"),
          limit(20)
        )
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          album_name: data.album_name,
          artist_id: data.artist_id,
          album_imageUrl: data.album_imageUrl,
          songs_id: data.songs_id || [],
        } as Album;
      });
    } catch (error) {
      console.error("Error searching albums:", error);
      throw error;
    }
  }
}