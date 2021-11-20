import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    private donorLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Donors...'
    });

    public donorList: UserProfile[] = [];

    constructor(
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController
    ) { }

    ngOnInit() {
        this.loadAllProfiles();
    }

    private async loadAllProfiles() {
        (await this.donorLoader).present();
        this.fireBaseService.fetchDonorProfiles();
        this.fireBaseService.userProfileChanged.subscribe(async () => {
            this.donorList = this.fireBaseService.userProfiles;
            (await this.donorLoader).dismiss();
        });
    }

}
