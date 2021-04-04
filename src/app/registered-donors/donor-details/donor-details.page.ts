import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from 'src/app/firebase/firebase.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { Donor } from '../registered-donors.page';

@Component({
    selector: 'app-donor-details',
    templateUrl: './donor-details.page.html',
    styleUrls: ['./donor-details.page.scss'],
})
export class DonorDetailsPage implements OnInit {

    public donorList: UserProfile[] = [];
    public donor: UserProfile;

    private loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading...'
    });

    constructor(
        private route: ActivatedRoute,
        private firebaseService: FireBaseService,
        private loadingController: LoadingController,

    ) { }

    async ngOnInit() {
        const donorId = this.route.snapshot.queryParams['uid'];
        this.donorList = this.firebaseService.userProfiles;
        this.donor = this.donorList.find((donor) => donor.uid === donorId.toString());

        if (this.donorList.length === 0) {
            (await this.loader).present();
            this.firebaseService.fetchDonorProfiles();
            this.firebaseService.userProfileChanged.subscribe(async () => {
                this.donorList = this.firebaseService.userProfiles;
                (await this.loader).dismiss();
                this.donor = this.donorList.find((donor) => donor.uid === donorId.toString());
            })
        }
    }

    public generateAddress(donor: Donor): string {
        if (!donor) return '';
        if (donor.addressLine1 && donor.addressLine2 && donor.city) {
            return `${donor.addressLine1}, ${donor.addressLine2}, ${donor.city}, ${donor.province}`;
        } else if (donor.addressLine1 && donor.addressLine2) {
            return `${donor.addressLine1}, ${donor.addressLine2}`;
        } else if (donor.addressLine1 && donor.city) {
            return `${donor.addressLine1}, ${donor.city}`;
        } else if (donor.addressLine2 && donor.city) {
            return `${donor.addressLine2}, ${donor.city}`;
        } else if (donor.city) {
            return `${donor.city}`;
        } else {
            return '';
        }
    }

    public call(): string {
        if (!this.donor) return;
        return `tel:+94${this.donor.mobileNumber}`;
    }
}
