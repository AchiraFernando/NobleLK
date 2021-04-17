import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonorDetailsPage } from './donor-details.page';

const routes: Routes = [
  {
    path: '',
    component: DonorDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorDetailsPageRoutingModule {}
