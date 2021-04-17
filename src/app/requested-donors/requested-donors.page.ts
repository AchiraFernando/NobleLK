import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';

@Component({
    selector: 'app-requested-donors',
    templateUrl: './requested-donors.page.html',
    styleUrls: ['./requested-donors.page.scss'],
})
export class RequestedDonorsPage implements OnInit {
    public donorList: UserProfile[] = [];

    private loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading...'
    });

    constructor(
        private navCtrl: NavController,
        private firebaseService: FireBaseService,
        private loadingController: LoadingController,
        private router: Router,
    ) { }

    async ngOnInit() {
        (await this.loader).present();
        this.firebaseService.fetchDonorProfiles();
        this.firebaseService.userProfileChanged.subscribe(async () => {
            this.donorList = this.firebaseService.userProfiles;
            (await this.loader).dismiss();
        })
    }

    public viewDonor(donorId: string): void {
        // this.router.navigate(["donor-details", donorId]);
        this.router.navigate(['donor-details'], { queryParams: { uid: donorId } });
    }

}