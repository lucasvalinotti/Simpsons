export interface Episode {
  id: number;
  airdate: string | null;
  episode_number: number;
  image_path: string | null;
  name: string;
  season: number;
  synopsis: string | null;
}

export interface EpisodeResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Episode[];
}

export interface EpisodeDetail extends Episode {
  description: string | null;
}
