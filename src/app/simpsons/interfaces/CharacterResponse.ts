export interface CharacterResponse {
  count: number;
  next: string;
  prev: string | null;
  pages: number;
  results: Result[];
}

export interface Result {
  id: number;
  age: number | null;
  birthdate: string | null;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}
