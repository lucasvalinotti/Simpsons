import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CharacterResponse } from '../interfaces/CharacterResponse';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {

  baseUrl = environment.baseUrl;
  http = inject(HttpClient)

  public getCharacters() {
    return this.http.get<CharacterResponse>(`${this.baseUrl}/characters`)
  }

}
