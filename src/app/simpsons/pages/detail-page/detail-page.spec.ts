import { HttpErrorResponse } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { CharacterByID } from '../../interfaces/CharacterByIdResponse';
import { CharacterService } from '../../services/character.service';
import DetailPage from './detail-page';

describe('DetailPage', () => {
  let request: Subject<CharacterByID>;
  let service: jasmine.SpyObj<CharacterService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj<CharacterService>('CharacterService', ['getCharacterById']);
    service.getCharacterById.and.callFake(() => {
      request = new Subject<CharacterByID>();
      return request.asObservable();
    });

    const paramMap = convertToParamMap({ id: '1' });
    await TestBed.configureTestingModule({
      imports: [DetailPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { paramMap: new Subject(), snapshot: { paramMap } } },
        { provide: CharacterService, useValue: service },
      ],
    }).compileComponents();
  });

  it('shows a skeleton until the character arrives', () => {
    const fixture = TestBed.createComponent(DetailPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-character-not-found')).toBeNull();

    request.next({ id: 1, name: 'Homero Simpson', status: 'Alive', gender: 'Male',
      age: 39, occupation: 'Inspector', phrases: [], portrait_path: '/homer.png' } as unknown as CharacterByID);
    request.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Homero Simpson');
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeNull();
    const portrait = fixture.nativeElement.querySelector('.portrait img') as HTMLImageElement;
    expect(portrait.src).toBe('https://cdn.thesimpsonsapi.com/1280/homer.png');
    expect(portrait.alt).toBe('Homero Simpson');

    portrait.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.portrait.no-image')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.portrait img')).toBeNull();
    expect(fixture.nativeElement.querySelector('.portrait span')?.textContent).toContain('Imagen no disponible');
    const favorite = fixture.nativeElement.querySelector('.favorite-button') as HTMLButtonElement;
    favorite.click();
    fixture.detectChanges();
    expect(favorite.getAttribute('aria-pressed')).toBe('true');
  });

  it('distinguishes a missing character from a request error and allows retry', () => {
    const fixture = TestBed.createComponent(DetailPage);
    fixture.detectChanges();
    request.error(new HttpErrorResponse({ status: 404 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-character-not-found')).toBeTruthy();

    fixture.componentInstance.loadCharacter();
    request.error(new HttpErrorResponse({ status: 500 }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-character-not-found')).toBeNull();

    (fixture.nativeElement.querySelector('app-error-state button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.getCharacterById).toHaveBeenCalledTimes(3);
    expect(fixture.nativeElement.querySelector('.detail-skeleton')).toBeTruthy();
  });
});
