import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FireBaseService } from 'src/app/firebase/firebase.service';
import { BloodRequest } from 'src/app/models/blood-request.model';
import { CompleteBloodRequestComponent } from '../complete-blood-request/complete-blood-request.component';

@Component({
  selector: 'app-view-blood-requests',
  templateUrl: './view-blood-requests.component.html',
  styleUrls: ['./view-blood-requests.component.scss'],
})
export class ViewBloodRequestsComponent implements OnInit {

    public bloodRequests: BloodRequest[] = [];

    private bloodRequestsLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Blood Requests...'
    });

    constructor(
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController,
        private modalController: ModalController,
    ) { }

    ngOnInit() {
        if (this.fireBaseService.bloodRequests && this.fireBaseService.bloodRequests.length === 0) {
            this.loadAllBloodRequests();
        } else {
            this.bloodRequests = this.fireBaseService.bloodRequests;
        }
    }

    private async loadAllBloodRequests() {
        (await this.bloodRequestsLoader).present();
        this.fireBaseService.fetchBloodRequests();
        this.fireBaseService.bloodReqestsChanged.subscribe(async () => {
            this.bloodRequests = this.fireBaseService.bloodRequests;
            (await this.bloodRequestsLoader).dismiss();
        });
    }

    public async bloodRequestClick(request: BloodRequest) {
        await this.presentReminderModal(request);
    }

    public async presentReminderModal(request: BloodRequest) {
        const modal = await this.modalController.create({
        component: CompleteBloodRequestComponent,
            cssClass: 'my-custom-class',
            componentProps: {
                request: request
            }
        });

        await modal.present();

        return modal.onDidDismiss();
    }

}
