export interface Song {
  id: string;
  song_name: string;
  artist_id: string[];
  audio_url: string;
  country: string;
  duration: number | null;
  love_count: number;
  play_count: number;
  song_imageUrl: string;
  year: number;
}

export interface CreateSongRequest {
  song_name: string;
  artist_id: string[];
  audio_url: string;
  country: string;
  duration: number | null;
  song_imageUrl: string;
  year: number;
}

export interface UpdateSongRequest {
  song_name?: string;
  artist_id?: string[];
  audio_url?: string;
  country?: string;
  duration?: number | null;
  song_imageUrl?: string;
  year?: number;
}
