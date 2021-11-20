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
                redirectTo: '/dashboard',
                pathMatch: 'full'
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
                path: 'request-blood',
                loadChildren: () => import('../request-form/request-form.module').then( m => m.RequestFormPageModule)
            },
            {
                path: 'otp-authentication',
                loadChildren: () => import('../otp-authentication/otp-authentication.module').then( m => m.OtpAuthenticationPageModule)
            },
            {
                path: 'requested-donors',
                loadChildren: () => import('../requested-donors/requested-donors.module').then( m => m.RequestedDonorsPageModule)
            },
            {
                path: 'donor-details',
                loadChildren: () => import('../requested-donors/donor-details/donor-details.module').then( m => m.DonorDetailsPageModule)
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('../forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
            },
            {
                path: 'donors',
                loadChildren: () => import('../donors/donors.module').then( m => m.DonorsPageModule)
            },
            {
                path: 'find-blood-banks',
                loadChildren: () => import('../find-donors/find-donors.module').then( m => m.FindDonorsPageModule)
            },
            {
                path: 'blood-request-detail',
                loadChildren: () => import('../blood-request-detail/blood-request-detail.module').then( m => m.BloodRequestDetailPageModule)
            },
        ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
