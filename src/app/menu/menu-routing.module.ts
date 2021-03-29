import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
    {
        path: '',
        component: MenuPage,
        children: [
            {
                path: '',
                loadChildren: () => import('../startup/startup.module').then( m => m.StartupPageModule)
            },
            {
                path: 'login',
                loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
            },
            {
                path: 'register',
                loadChildren: () => import('../register/register.module').then( m => m.RegisterPageModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
            },
            {
                path: 'request-form',
                loadChildren: () => import('../request-form/request-form.module').then( m => m.RequestFormPageModule)
            },
        ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
