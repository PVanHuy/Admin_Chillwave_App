export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  phone?: string;
  photoUrl?: string;
  position?: string;
  role: "admin" | "user";
  created_at: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  bio?: string;
  phone?: string;
  photoUrl?: string;
  position?: string;
  role: "admin" | "user";
}

export interface UpdateUserRequest {
  username?: string;
  bio?: string;
  phone?: string;
  photoUrl?: string;
  position?: string;
  role?: "admin" | "user";
}
