export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumName?: string;
  duration: number; // in seconds
  audioURL: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  lyrics?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  likesCount: number;
  isExplicit: boolean;
}

export interface CreateSongRequest {
  title: string;
  artistId: string;
  albumId?: string;
  duration: number;
  audioURL: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  lyrics?: string;
  isActive: boolean;
  isExplicit: boolean;
}

export interface UpdateSongRequest {
  title?: string;
  artistId?: string;
  albumId?: string;
  duration?: number;
  audioURL?: string;
  imageURL?: string;
  genre?: string[];
  releaseDate?: Date;
  lyrics?: string;
  isActive?: boolean;
  isExplicit?: boolean;
}
