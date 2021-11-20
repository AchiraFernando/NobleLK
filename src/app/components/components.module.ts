import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DonorInformationComponent } from '../components/donor-information/donor-information.component';
import { CompleteBloodRequestComponent } from './complete-blood-request/complete-blood-request.component';
import { DonationReminderComponent } from './donation-reminder/donation-reminder.component';
import { ViewBloodRequestsComponent } from './view-blood-requests/view-blood-requests.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  declarations: [
    DonorInformationComponent,
    ViewBloodRequestsComponent,
    DonationReminderComponent,
    CompleteBloodRequestComponent
  ],
  exports: [
    DonorInformationComponent,
    ViewBloodRequestsComponent,
    DonationReminderComponent,
    CompleteBloodRequestComponent
  ]
})
export class ComponentsModule {}
