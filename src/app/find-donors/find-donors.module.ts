import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindDonorsPageRoutingModule } from './find-donors-routing.module';

import { FindDonorsPage } from './find-donors.page';
import { MapModule } from '../map/map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindDonorsPageRoutingModule,
    MapModule,
  ],
  declarations: [FindDonorsPage]
})
export class FindDonorsPageModule {}
