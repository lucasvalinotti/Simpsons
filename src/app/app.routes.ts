import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Springfield!',
    loadComponent: () => import('./simpsons/pages/home-page/home-page')
  },
  {
    path: 'characters',
    title: 'Personajes',
    loadComponent: () => import('./simpsons/pages/characters-page/characters-page')
  },
  {
    path: 'character/:id',
    title: 'Detalles',
    loadComponent: () => import('./simpsons/pages/detail-page/detail-page')
  },
  {
    path: 'locations',
    title: 'Ubicaciones',
    loadComponent: () => import('./simpsons/pages/locations-page/locations-page')
  },
  {
    path: 'location/:id',
    title: 'Detalle de ubicación',
    loadComponent: () => import('./simpsons/pages/location-detail-page/location-detail-page')
  },
  {
    path: 'episodes',
    title: 'Episodios',
    loadComponent: () => import('./simpsons/pages/episodes-page/episodes-page')
  },
  {
    path: 'episode/:id',
    title: 'Detalle de episodio',
    loadComponent: () => import('./simpsons/pages/episode-detail-page/episode-detail-page')
  },
  {
    path: 'favorites',
    title: 'Favoritos',
    loadComponent: () => import('./simpsons/pages/favorites-page/favorites-page')
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
