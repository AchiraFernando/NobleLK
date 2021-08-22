import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from '../cache.service';
import { FireBaseService } from '../firebase/firebase.service';
import { BloodRequest } from '../models/blood-request.model';
import { UserProfile } from '../models/user-profile.model';
import { User } from '../models/user.model';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-requested-donors',
    templateUrl: './requested-donors.page.html',
    styleUrls: ['./requested-donors.page.scss'],
})
export class RequestedDonorsPage implements OnInit {
    public donorList: UserProfile[] = [];
    public filteredList: UserProfile[] = [];
    public sortedList: UserProfile[] = [];
    public sortedAndFilteredList: UserProfile[] = [];
    public requestId: string;

    private loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading...'
    });
    private requestLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Request...'
    });

    public showAll: boolean = false;
    public sortByLocation: boolean = true;

    public get finalDonorList(): UserProfile[] {
        if (this.showAll) {
            if (this.sortByLocation) { return this.sortedByLocation(this.donorList); }
            return this.donorList;
        }
        if (this.sortByLocation) { return this.sortedAndFilteredList; }
        return this.filteredList;
    }

    constructor(
        private firebaseService: FireBaseService,
        private loadingController: LoadingController,
        private router: Router,
        private cacheService: CacheService,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
        private toastService: ToastService,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.requestId = this.route.snapshot.queryParams['requestId'];
        if (!this.cacheService.lastRequest || this.cacheService.lastRequest.requestId !== this.requestId) {
            (await this.requestLoader).present();
            this.firebaseService.getBloodRequest(this.requestId).then(async (bloodRequest: BloodRequest) => {
                this.cacheService.loadRequest(bloodRequest);
                this.filteredList = this.filterByBloodGroup(this.donorList);
                this.sortedAndFilteredList = this.sortedByLocation(this.filteredList);
                (await this.requestLoader).dismiss();
            }).catch(async (error) => {
                this.toastService.generateToast(error, 5000);
                (await this.requestLoader).dismiss();
            });
        } else {
            this.filteredList = this.filterByBloodGroup(this.donorList);
            this.sortedAndFilteredList = this.sortedByLocation(this.filteredList);
        }

        (await this.loader).present();
        this.firebaseService.fetchDonorProfiles();
        this.firebaseService.userProfileChanged.subscribe(async () => {
            this.donorList = this.firebaseService.userProfiles;
            this.filteredList = this.filterByBloodGroup(this.donorList);
            this.sortedAndFilteredList = this.sortedByLocation(this.filteredList);
            (await this.loader).dismiss();
        });
    }

    private filterByBloodGroup(donorList: UserProfile[]): UserProfile[] {
        const filteredList: UserProfile[] = [];
        donorList.forEach(profile => {
            if (this.cacheService.lastRequest.bloodGroup === profile.bloodGroup) {
                filteredList.push(profile);
            }
        });
        return filteredList;
    }

    private sortedByLocation(donorList: UserProfile[]): UserProfile[] {
        // let distance = google.maps.geometry.spherical.computeDistanceBetween()
        const sortedList: UserProfile[] = [];
        const dicDistanceToDonor: { [uid: string]: number; } = {};
        donorList.forEach(donor => {
            const distance = this.haversine_distance(
                new google.maps.LatLng(this.cacheService.lastRequest.latitude, this.cacheService.lastRequest.longitude),
                new google.maps.LatLng(donor.latitude, donor.longitude),
            );
            dicDistanceToDonor[donor.uid] = distance;
        });
        let sortedDistances = Object.values(dicDistanceToDonor).sort();
        sortedDistances.forEach(distance => {
            let uid = Object.keys(dicDistanceToDonor).find(key => dicDistanceToDonor[key] === distance);
            sortedList.push(donorList.find((donor) => donor.uid === uid));
        });

        return sortedList;
    }

    haversine_distance(mk1: google.maps.LatLng, mk2: google.maps.LatLng) {
        let R = 3958.8; // Radius of the Earth in miles
        let rlat1 = mk1.lat() * (Math.PI / 180); // Convert degrees to radians
        let rlat2 = mk2.lat() * (Math.PI / 180); // Convert degrees to radians
        let difflat = rlat2 - rlat1; // Radian difference (latitudes)
        let difflon = (mk2.lng() - mk1.lng()) * (Math.PI / 180); // Radian difference (longitudes)

        let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return d;
    }

    private sortObjectByValues(o: { [uid: string]: number; }) {
        return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    }

    public viewDonor(donorId: string): void {
        // this.router.navigate(["donor-details", donorId]);
        this.router.navigate(['donor-details'], { queryParams: { uid: donorId, requestId: this.requestId } });
    }

}