import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestFormPageRoutingModule } from './request-form-routing.module';

import { RequestFormPage } from './request-form.page';
import { MapModule } from '../map/map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RequestFormPageRoutingModule,
    MapModule,
  ],
  declarations: [RequestFormPage],
  providers: [FormBuilder],
})
export class RequestFormPageModule {}
