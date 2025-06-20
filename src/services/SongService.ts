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
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Song, CreateSongRequest, UpdateSongRequest } from "../models/Song";
import { Artist } from "../models/Artist";
import { Album } from "../models/Album";
import { ArtistService } from "./ArtistService";
import { AlbumService } from "./AlbumService";

const COLLECTION_NAME = "songs";

const docToSong = (
  doc: DocumentSnapshot<DocumentData>,
  artists: Artist[],
  albums: Album[]
): Song => {
  const data = doc.data();
  if (!data) {
    // This case should ideally not happen if doc.exists() is checked before calling
    throw new Error("Document data is empty!");
  }
  const artistId =
    data.artist_id && data.artist_id.length > 0 ? data.artist_id[0] : "";
  const artist = artists.find((a) => a.id === artistId);
  const album = data.album_id
    ? albums.find((a) => a.id === data.album_id)
    : undefined;

  const releaseDate = data.year
    ? new Date(data.year, 0, 1)
    : data.releaseDate?.toDate() || new Date(0);

  return {
    id: doc.id,
    title: data.song_name || "Unknown Title",
    artistId: artistId,
    artistName: artist ? artist.name : "Unknown Artist",
    albumId: data.album_id || undefined,
    albumName: album ? album.title : "Unknown Album",
    duration: data.duration || 0,
    audioURL: data.audio_url || "",
    imageURL: data.song_imageUrl || data.song_imageUrle || "",
    genre: data.genre || [],
    releaseDate: releaseDate,
    lyrics: data.lyrics || "",
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: data.createdAt?.toDate() || new Date(0),
    updatedAt: data.updatedAt?.toDate() || new Date(0),
    playCount: data.play_count || 0,
    likesCount: data.love_count || 0,
    isExplicit: data.isExplicit || false,
  };
};

export class SongService {
  static async getAllSongs(): Promise<Song[]> {
    try {
      const [artists, albums, songsSnapshot] = await Promise.all([
        ArtistService.getAllArtists(),
        AlbumService.getAllAlbums(),
        getDocs(query(collection(db, COLLECTION_NAME))),
      ]);

      return songsSnapshot.docs.map((doc) => docToSong(doc, artists, albums));
    } catch (error) {
      console.error("Error getting songs:", error);
      throw error;
    }
  }

  static async getSongById(id: string): Promise<Song | null> {
    try {
      const [songDoc, artists, albums] = await Promise.all([
        getDoc(doc(db, COLLECTION_NAME, id)),
        ArtistService.getAllArtists(),
        AlbumService.getAllAlbums(),
      ]);

      if (songDoc.exists()) {
        return docToSong(songDoc, artists, albums);
      }
      return null;
    } catch (error) {
      console.error("Error getting song:", error);
      throw error;
    }
  }

  static async createSong(songData: CreateSongRequest): Promise<string> {
    try {
      const now = Timestamp.now();
      const newSongData = {
        song_name: songData.title,
        artist_id: [songData.artistId],
        album_id: songData.albumId,
        duration: songData.duration,
        audio_url: songData.audioURL,
        song_imageUrl: songData.imageURL,
        genre: songData.genre,
        releaseDate: Timestamp.fromDate(songData.releaseDate),
        lyrics: songData.lyrics,
        isActive: songData.isActive,
        isExplicit: songData.isExplicit,
        createdAt: now,
        updatedAt: now,
        play_count: 0,
        love_count: 0,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newSongData);
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

      const updateData: any = { updatedAt: Timestamp.now() };

      if (updates.title) updateData.song_name = updates.title;
      if (updates.artistId) updateData.artist_id = [updates.artistId];
      if (updates.albumId) updateData.album_id = updates.albumId;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.audioURL) updateData.audio_url = updates.audioURL;
      if (updates.imageURL) updateData.song_imageUrl = updates.imageURL;
      if (updates.genre) updateData.genre = updates.genre;
      if (updates.releaseDate)
        updateData.releaseDate = Timestamp.fromDate(updates.releaseDate);
      if (updates.lyrics) updateData.lyrics = updates.lyrics;
      if (updates.isActive !== undefined)
        updateData.isActive = updates.isActive;
      if (updates.isExplicit !== undefined)
        updateData.isExplicit = updates.isExplicit;

      await updateDoc(songRef, updateData);
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
          } as Song)
      );
    } catch (error) {
      console.error("Error searching songs:", error);
      throw error;
    }
  }

  static async getSongsByArtist(artistId: string): Promise<Song[]> {
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
          } as Song)
      );
    } catch (error) {
      console.error("Error getting songs by artist:", error);
      throw error;
    }
  }

  static async getSongsByAlbum(albumId: string): Promise<Song[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("albumId", "==", albumId),
          orderBy("createdAt", "asc")
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
          } as Song)
      );
    } catch (error) {
      console.error("Error getting songs by album:", error);
      throw error;
    }
  }

  static async getSongsWithLyricsCount(): Promise<number> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().lyrics) {
        count++;
      }
    });
    return count;
  }

  static async getExplicitSongsCount(): Promise<number> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isExplicit", "==", true)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }
}
