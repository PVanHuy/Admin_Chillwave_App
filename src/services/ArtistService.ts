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
import {
  Artist,
  CreateArtistRequest,
  UpdateArtistRequest,
} from "../models/Artist";

const COLLECTION_NAME = "artists";
const SONGS_COLLECTION = "songs";
const ALBUMS_COLLECTION = "albums";

export class ArtistService {
  static async getAllArtists(): Promise<Artist[]> {
    try {
      const artistsQuery = query(collection(db, COLLECTION_NAME));
      const artistsSnapshot = await getDocs(artistsQuery);

      const artistsWithCounts = await Promise.all(
        artistsSnapshot.docs.map(async (doc) => {
          const artistData = doc.data();
          const artistId = doc.id;

          // Get songs count
          const songsQuery = query(
            collection(db, SONGS_COLLECTION),
            where("artist_id", "array-contains", artistId)
          );
          const songsSnapshot = await getCountFromServer(songsQuery);
          const songsCount = songsSnapshot.data().count;

          // Get albums count
          const albumsQuery = query(
            collection(db, ALBUMS_COLLECTION),
            where("artist_id", "==", artistId)
          );
          const albumsSnapshot = await getCountFromServer(albumsQuery);
          const albumsCount = albumsSnapshot.data().count;

          return {
            id: artistId,
            name: artistData.artist_name,
            imageURL: artistData.artist_images,
            bio: artistData.bio,
            country: artistData.country,
            genre: artistData.genre,
            socialLinks: artistData.socialLinks,
            isActive: artistData.isActive,
            songsCount: songsCount,
            albumsCount: albumsCount,
            followersCount: artistData.love_count || 0,
            createdAt: artistData.createdAt?.toDate(),
            updatedAt: artistData.updatedAt?.toDate(),
          } as Artist;
        })
      );

      return artistsWithCounts;
    } catch (error) {
      console.error("Error getting artists with counts:", error);
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
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
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
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...artistData,
        createdAt: now,
        updatedAt: now,
        songsCount: 0,
        albumsCount: 0,
        followersCount: 0,
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
        updatedAt: Timestamp.now(),
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
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
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
          } as Artist)
      );
    } catch (error) {
      console.error("Error searching artists:", error);
      throw error;
    }
  }

  static async getArtistsByGenre(genre: string): Promise<Artist[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("genre", "array-contains", genre),
          orderBy("followersCount", "desc"),
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
          } as Artist)
      );
    } catch (error) {
      console.error("Error getting artists by genre:", error);
      throw error;
    }
  }

  static async getVerifiedArtistsCount(): Promise<number> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isActive", "==", true)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
