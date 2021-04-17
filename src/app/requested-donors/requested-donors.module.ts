import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestedDonorsPageRoutingModule } from './requested-donors-routing.module';

import { RequestedDonorsPage } from './requested-donors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestedDonorsPageRoutingModule
  ],
  declarations: [RequestedDonorsPage]
})
export class RequestedDonorsPageModule {}
