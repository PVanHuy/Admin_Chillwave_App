export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  description: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  trackList: string[]; // song IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  likesCount: number;
  type: "album" | "single" | "ep";
}

export interface CreateAlbumRequest {
  title: string;
  artistId: string;
  description: string;
  imageURL?: string;
  genre: string[];
  releaseDate: Date;
  trackList: string[];
  isActive: boolean;
  type: "album" | "single" | "ep";
}

export interface UpdateAlbumRequest {
  title?: string;
  artistId?: string;
  description?: string;
  imageURL?: string;
  genre?: string[];
  releaseDate?: Date;
  trackList?: string[];
  isActive?: boolean;
  type?: "album" | "single" | "ep";
}
