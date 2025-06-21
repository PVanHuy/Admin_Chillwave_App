export interface Artist {
  id: string;
  artist_name: string;
  bio: string;
  artist_images: string;
  love_count: number;
}

export interface CreateArtistRequest {
  artist_name: string;
  bio: string;
  artist_images: string;
}

export interface UpdateArtistRequest {
  artist_name?: string;
  bio?: string;
  artist_images?: string;
}
