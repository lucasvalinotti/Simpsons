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
    path: 'favorites',
    title: 'Favoritos',
    loadComponent: () => import('./simpsons/pages/favorites-page/favorites-page')
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
