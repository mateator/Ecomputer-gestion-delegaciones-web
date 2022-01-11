import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./new-user/new-user.module').then( m => m.NewUserModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'data-dialog',
    loadChildren: () => import('./data-dialog/data-dialog.module').then( m => m.DataDialogModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
