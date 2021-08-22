import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorDetailsPageRoutingModule } from './donor-details-routing.module';

import { DonorDetailsPage } from './donor-details.page';
import { MapModule } from 'src/app/map/map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorDetailsPageRoutingModule,
    MapModule,
  ],
  declarations: [DonorDetailsPage]
})
export class DonorDetailsPageModule {}
