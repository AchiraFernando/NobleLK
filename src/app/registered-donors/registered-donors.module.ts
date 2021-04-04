import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisteredDonorsPageRoutingModule } from './registered-donors-routing.module';

import { RegisteredDonorsPage } from './registered-donors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisteredDonorsPageRoutingModule
  ],
  declarations: [RegisteredDonorsPage]
})
export class RegisteredDonorsPageModule {}
