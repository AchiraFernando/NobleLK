import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CacheService } from 'src/app/cache.service';
import { FireBaseService } from 'src/app/firebase/firebase.service';
import { BloodRequest } from 'src/app/models/blood-request.model';
import { UserProfile } from 'src/app/models/user-profile.model';
import { ToastService } from 'src/app/toast-service/toast.service';

@Component({
    selector: 'app-donor-details',
    templateUrl: './donor-details.page.html',
    styleUrls: ['./donor-details.page.scss'],
})
export class DonorDetailsPage implements OnInit {

    public donorList: UserProfile[] = [];
    public donor: UserProfile;
    public requestId: string;

    private loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading...'
    });

    private requestLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Request...'
    });

    constructor(
        private route: ActivatedRoute,
        private firebaseService: FireBaseService,
        private loadingController: LoadingController,
        private cacheService: CacheService,
        private toastService: ToastService,
    ) { }

    _currentCoordinates: google.maps.LatLng;
    public get currentCoordinates(): google.maps.LatLng {
        return this._currentCoordinates;
    }
    public set currentCoordinates(coordinates: google.maps.LatLng) {
        this._currentCoordinates = coordinates;
    }

    public secondLocation: google.maps.LatLng;

    async ngOnInit() {
        const donorId = this.route.snapshot.queryParams['uid'];
        this.requestId = this.route.snapshot.queryParams['requestId'];

        this.loadLastRequest();

        this.donorList = this.firebaseService.userProfiles;
        this.donor = this.donorList.find((donor) => donor.uid === donorId.toString());
        if (this.donor) { this.secondLocation = new google.maps.LatLng(this.donor.latitude, this.donor.longitude); }

        if (this.cacheService.userProfile) {
            this.currentCoordinates = new google.maps.LatLng(
                this.cacheService.userProfile.latitude, this.cacheService.userProfile.longitude);
        }

        if (this.donorList.length === 0) {
            (await this.loader).present();
            this.firebaseService.fetchDonorProfiles();
            this.firebaseService.userProfileChanged.subscribe(async () => {
                this.donorList = this.firebaseService.userProfiles;
                (await this.loader).dismiss();
                this.donor = this.donorList.find((donor) => donor.uid === donorId.toString());
                if (this.donor) { this.secondLocation = new google.maps.LatLng(this.donor.latitude, this.donor.longitude); }
            });
        }
    }

    private async loadLastRequest() {
        if (!this.cacheService.lastRequest || this.cacheService.lastRequest.requestId !== this.requestId) {
            (await this.requestLoader).present();
            this.firebaseService.getBloodRequest(this.requestId).then(async (bloodRequest: BloodRequest) => {
                this.cacheService.loadRequest(bloodRequest);
                this.currentCoordinates = new google.maps.LatLng(bloodRequest.latitude, bloodRequest.longitude);
                (await this.requestLoader).dismiss();
            }).catch(async (error) => {
                this.toastService.generateToast(error, 5000);
                (await this.requestLoader).dismiss();
            });
        } else {
            this.currentCoordinates = new google.maps.LatLng(
                this.cacheService.lastRequest.latitude, this.cacheService.lastRequest.longitude);
        }
    }

    public generateAddress(donor: UserProfile): string {
        if (!donor) { return ''; }
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
        if (!this.donor) { return; }
        return `tel:+94${this.donor.mobileNumber}`;
    }
}
