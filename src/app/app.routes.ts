import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'projects/skinmatch-ai',
    loadComponent: () =>
      import('./pages/project-case-studies/skinmatch-ai-case-study/skinmatch-ai-case-study.component').then(
        (component) => component.SkinmatchAiCaseStudyComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
