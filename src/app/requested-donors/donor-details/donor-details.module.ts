import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorDetailsPageRoutingModule } from './donor-details-routing.module';

import { DonorDetailsPage } from './donor-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorDetailsPageRoutingModule
  ],
  declarations: [DonorDetailsPage]
})
export class DonorDetailsPageModule {}
