import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorsPageRoutingModule } from './donors-routing.module';

import { DonorsPage } from './donors.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    DonorsPage,
  ]
})
export class DonorsPageModule {}
