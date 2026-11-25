export interface Location {
  id: number;
  name: string;
  image_path: string | null;
  town: string | null;
  use: string | null;
}

export interface LocationResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: Location[];
}

export interface LocationDetail extends Location {
  description: string | null;
  first_appearance_ep_id: number | null;
  first_appearance_sh_id: number | null;
  first_appearance_ep: { id: number; name: string } | null;
  first_appearance_sh: { id: number; name: string } | null;
}
