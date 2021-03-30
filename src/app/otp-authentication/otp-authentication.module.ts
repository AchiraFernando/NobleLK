import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpAuthenticationPageRoutingModule } from './otp-authentication-routing.module';

import { OtpAuthenticationPage } from './otp-authentication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtpAuthenticationPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [OtpAuthenticationPage]
})
export class OtpAuthenticationPageModule {}
