import { Component, Input, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from 'src/app/firebase/firebase.service';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
  selector: 'app-donor-information',
  templateUrl: './donor-information.component.html',
  styleUrls: ['./donor-information.component.scss'],
})
export class DonorInformationComponent implements OnInit {

    @Input()
    simpleView = false;

    private donorLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Donors...'
    });

    public donorList: UserProfile[] = [];

    constructor(
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController
    ) { }

    ngOnInit() {
        if (this.fireBaseService.userProfiles && this.fireBaseService.userProfiles.length === 0) {
            this.loadAllProfiles();
        } else {
            this.donorList = this.fireBaseService.userProfiles;
        }
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
