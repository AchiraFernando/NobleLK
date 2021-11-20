import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { BloodRequest } from '../models/blood-request.model';

@Component({
  selector: 'app-blood-request-detail',
  templateUrl: './blood-request-detail.page.html',
  styleUrls: ['./blood-request-detail.page.scss'],
})
export class BloodRequestDetailPage implements OnInit {

    public bloodRequests: BloodRequest[] = [];

    private bloodRequestsLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Blood Requests...'
    });

    constructor(
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController
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

}
