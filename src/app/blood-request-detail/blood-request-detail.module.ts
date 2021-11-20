import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BloodRequestDetailPageRoutingModule } from './blood-request-detail-routing.module';

import { BloodRequestDetailPage } from './blood-request-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BloodRequestDetailPageRoutingModule
  ],
  declarations: [BloodRequestDetailPage]
})
export class BloodRequestDetailPageModule {}
