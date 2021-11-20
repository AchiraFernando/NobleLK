import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { BloodBank } from '../models/blood-bank.model';
import { UserProfile } from '../models/user-profile.model';

@Component({
  selector: 'app-find-donors',
  templateUrl: './find-donors.page.html',
  styleUrls: ['./find-donors.page.scss'],
})
export class FindDonorsPage implements OnInit {
    public donorList: UserProfile[] = [];
    public bloodBankList: BloodBank[] = [];

    private _showDonors: boolean = false;
    public get showDonors() : boolean {
        return this._showDonors;
    }
    public set showDonors(value: boolean) {
        this._showDonors = value;
        if (value) {
            this.loadAllProfiles();
        } else {
            this.donorList = [];
        }
    }



    private donorLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Donors...'
    });

    private bloodBankLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Blood Banks...'
    });

    constructor(
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController
    ) { }

    ngOnInit() {
        this.loadAllProfiles();
        this.loadAllBloodBanks();
    }

    private async loadAllProfiles() {
        (await this.donorLoader).present();
        this.fireBaseService.fetchDonorProfiles();
        this.fireBaseService.userProfileChanged.subscribe(async () => {
            this.donorList = this.fireBaseService.userProfiles;
            (await this.donorLoader).dismiss();
        });
    }

    private async loadAllBloodBanks() {
        (await this.bloodBankLoader).present();
        this.fireBaseService.fetchBloodBanks();
        this.fireBaseService.bloodBanksChanged.subscribe(async () => {
            this.bloodBankList = this.fireBaseService.bloodBanks;
            (await this.bloodBankLoader).dismiss();
        });
    }

}
