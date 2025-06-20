export interface Artist {
  id: string;
  name: string; // Will be mapped from artist_name
  bio: string;
  imageURL: string; // Will be mapped from artist_images
  country: string;
  genre: string[];
  socialLinks: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  isActive: boolean;
  songsCount?: number;
  albumsCount?: number;
  followersCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateArtistRequest {
  name: string;
  bio: string;
  imageURL: string;
  country: string;
  genre: string[];
  socialLinks: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  isActive: boolean;
}

export interface UpdateArtistRequest {
  name?: string;
  bio?: string;
  imageURL?: string;
  country?: string;
  genre?: string[];
  socialLinks?: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  isActive?: boolean;
}
