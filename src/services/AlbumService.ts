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
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Album, CreateAlbumRequest, UpdateAlbumRequest } from "../models/Album";
import { Artist } from "../models/Artist";
import { ArtistService } from "./ArtistService";

const COLLECTION_NAME = "albums";

const docToAlbum = (
  doc: DocumentSnapshot<DocumentData>,
  artists: Artist[]
): Album => {
  const data = doc.data()!;
  const artist = artists.find((a) => a.id === data.artist_id);

  return {
    id: doc.id,
    title: data.album_name || data.title || "Unknown Album",
    artistId: data.artist_id || "",
    artistName: artist ? artist.name : "Unknown Artist",
    description: data.description || "",
    imageURL: data.album_image || data.imageURL || "",
    genre: data.genre || [],
    releaseDate: data.releaseDate?.toDate() || new Date(0),
    trackList: data.trackList || [],
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: data.createdAt?.toDate() || new Date(0),
    updatedAt: data.updatedAt?.toDate() || new Date(0),
    playCount: data.playCount || 0,
    likesCount: data.likesCount || 0,
    type: data.type || "album",
  };
};

export class AlbumService {
  static async getAllAlbums(): Promise<Album[]> {
    try {
      const [artists, albumsSnapshot] = await Promise.all([
        ArtistService.getAllArtists(),
        getDocs(query(collection(db, COLLECTION_NAME))),
      ]);

      return albumsSnapshot.docs.map((doc) => docToAlbum(doc, artists));
    } catch (error) {
      console.error("Error getting albums:", error);
      throw error;
    }
  }

  static async getAlbumById(id: string): Promise<Album | null> {
    try {
      const [albumDoc, artists] = await Promise.all([
        getDoc(doc(db, COLLECTION_NAME, id)),
        ArtistService.getAllArtists(),
      ]);

      if (albumDoc.exists()) {
        return docToAlbum(albumDoc, artists);
      }
      return null;
    } catch (error) {
      console.error("Error getting album:", error);
      throw error;
    }
  }

  static async createAlbum(albumData: CreateAlbumRequest): Promise<string> {
    try {
      const now = Timestamp.now();
      const newAlbumData = {
        album_name: albumData.title,
        artist_id: albumData.artistId,
        description: albumData.description,
        album_image: albumData.imageURL,
        genre: albumData.genre,
        releaseDate: Timestamp.fromDate(albumData.releaseDate),
        trackList: albumData.trackList,
        isActive: albumData.isActive,
        type: albumData.type,
        createdAt: now,
        updatedAt: now,
        playCount: 0,
        likesCount: 0,
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newAlbumData);
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
      const updateData: any = {
        updatedAt: Timestamp.now(),
      };

      if (updates.title) updateData.album_name = updates.title;
      if (updates.artistId) updateData.artist_id = updates.artistId;
      if (updates.description) updateData.description = updates.description;
      if (updates.imageURL) updateData.album_image = updates.imageURL;
      if (updates.genre) updateData.genre = updates.genre;
      if (updates.trackList) updateData.trackList = updates.trackList;
      if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
      if (updates.type) updateData.type = updates.type;

      if (updates.releaseDate) {
        updateData.releaseDate = Timestamp.fromDate(updates.releaseDate);
      }

      await updateDoc(albumRef, updateData);
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
          where("title", ">=", searchTerm),
          where("title", "<=", searchTerm + "\uf8ff"),
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
            releaseDate: doc.data().releaseDate?.toDate(),
          } as Album)
      );
    } catch (error) {
      console.error("Error searching albums:", error);
      throw error;
    }
  }

  static async getAlbumsByArtist(artistId: string): Promise<Album[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("artistId", "==", artistId),
          orderBy("releaseDate", "desc")
        )
      );
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            releaseDate: doc.data().releaseDate?.toDate(),
          } as Album)
      );
    } catch (error) {
      console.error("Error getting albums by artist:", error);
      throw error;
    }
  }

  static async getAlbumsByType(
    type: "album" | "single" | "ep"
  ): Promise<Album[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("type", "==", type),
          orderBy("releaseDate", "desc"),
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
            releaseDate: doc.data().releaseDate?.toDate(),
          } as Album)
      );
    } catch (error) {
      console.error("Error getting albums by type:", error);
      throw error;
    }
  }
}
