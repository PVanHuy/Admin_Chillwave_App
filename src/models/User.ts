export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  favoriteArtists?: string[];
  favoriteSongs?: string[];
  favoriteAlbums?: string[];
}

export interface CreateUserRequest {
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: "admin" | "user";
  isActive: boolean;
}

export interface UpdateUserRequest {
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: "admin" | "user";
  isActive?: boolean;
}
