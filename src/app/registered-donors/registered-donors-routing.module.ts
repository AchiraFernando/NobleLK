import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisteredDonorsPage } from './registered-donors.page';

const routes: Routes = [
    {
        path: '',
        component: RegisteredDonorsPage
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisteredDonorsPageRoutingModule {}
