import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AvatarModule } from 'ngx-avatar';
import { MapComponent } from './map.component';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AvatarModule,
  ],
  declarations: [MapComponent],
  exports: [MapComponent],
  providers: [Geolocation]
})
export class MapModule {}
