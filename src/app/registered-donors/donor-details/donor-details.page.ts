import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    constructor(
        private route: ActivatedRoute,
        private firebaseService: FireBaseService,
    ) { }

    ngOnInit() {
        this.donorList = this.firebaseService.userProfiles;
        const donorId = this.route.snapshot.queryParams['uid'];
        this.donor = this.donorList.find((donor) => donor.uid === donorId.toString());
    }

    public generateAddress(donor: Donor): string {
        return `${donor.addressLine1}, ${donor.addressLine2}, ${donor.city}, ${donor.province}`;
    }
}
