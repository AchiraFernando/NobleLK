import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestedDonorsPage } from './requested-donors.page';

const routes: Routes = [
    {
        path: '',
        component: RequestedDonorsPage
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestedDonorsPageRoutingModule {}
