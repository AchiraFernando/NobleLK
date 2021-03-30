import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpAuthenticationPage } from './otp-authentication.page';

const routes: Routes = [
  {
    path: '',
    component: OtpAuthenticationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpAuthenticationPageRoutingModule {}
