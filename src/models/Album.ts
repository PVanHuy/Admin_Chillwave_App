export interface Album {
  id: string;
  album_name: string;
  artist_id: string;
  album_imageUrl: string;
  songs_id: string[];
}

export interface CreateAlbumRequest {
  album_name: string;
  artist_id: string;
  album_imageUrl: string;
  songs_id: string[];
}

export interface UpdateAlbumRequest {
  album_name?: string;
  artist_id?: string;
  album_imageUrl?: string;
  songs_id?: string[];
}
