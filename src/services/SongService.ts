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
import { Song, CreateSongRequest, UpdateSongRequest } from "../models/Song";

const COLLECTION_NAME = "songs";

export class SongService {
  static async getAllSongs(): Promise<Song[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          song_name: data.song_name,
          artist_id: data.artist_id || [],
          audio_url: data.audio_url,
          country: data.country,
          duration: data.duration,
          love_count: data.love_count,
          play_count: data.play_count,
          song_imageUrl: data.song_imageUrl,
          year: data.year,
        } as Song;
      });
    } catch (error) {
      console.error("Error getting songs:", error);
      throw error;
    }
  }

  static async getSongById(id: string): Promise<Song | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          song_name: data.song_name,
          artist_id: data.artist_id || [],
          audio_url: data.audio_url,
          country: data.country,
          duration: data.duration,
          love_count: data.love_count,
          play_count: data.play_count,
          song_imageUrl: data.song_imageUrl,
          year: data.year,
        } as Song;
      }
      return null;
    } catch (error) {
      console.error("Error getting song:", error);
      throw error;
    }
  }

  static async createSong(songData: CreateSongRequest): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...songData,
        love_count: 0,
        play_count: 0,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating song:", error);
      throw error;
    }
  }

  static async updateSong(
    id: string,
    updates: UpdateSongRequest
  ): Promise<void> {
    try {
      const songRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(songRef, { ...updates });
    } catch (error) {
      console.error("Error updating song:", error);
      throw error;
    }
  }

  static async deleteSong(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting song:", error);
      throw error;
    }
  }

  static async searchSongs(searchTerm: string): Promise<Song[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("song_name", ">=", searchTerm),
          where("song_name", "<=", searchTerm + "\uf8ff"),
          limit(20)
        )
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          song_name: data.song_name,
          artist_id: data.artist_id || [],
          audio_url: data.audio_url,
          country: data.country,
          duration: data.duration,
          love_count: data.love_count,
          play_count: data.play_count,
          song_imageUrl: data.song_imageUrl,
          year: data.year,
        } as Song;
      });
    } catch (error) {
      console.error("Error searching songs:", error);
      throw error;
    }
  }
}