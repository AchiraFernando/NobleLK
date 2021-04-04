import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';

@Component({
    selector: 'app-registered-donors',
    templateUrl: './registered-donors.page.html',
    styleUrls: ['./registered-donors.page.scss'],
})
export class RegisteredDonorsPage implements OnInit {

    public donorList1: Donor[] = [
        new Donor('123', 'Achira', 'Fernando', '1001', 'A+', 23, 715982164, '18 Podusewa Mawatha', 'Walana', 'Panadura', 'Western', '971284749V', 'achirafernando97@gmail.com'),
        new Donor('456', 'Isuru', 'Fernando', '1002', 'B+', 23, 487584154, '18 Podusewa Mawatha', 'Walana', 'Panadura', 'Western', '971284749V', 'achirafernando97@gmail.com'),
        new Donor('789', 'Kasun', 'Fernando', '1003', 'C+', 23, 718958628, '18 Podusewa Mawatha', 'Walana', 'Panadura', 'Western', '971284749V', 'achirafernando97@gmail.com'),
        new Donor('159', 'Yasiru', 'Fernando', '1004', 'D+', 23, 748574125, '18 Podusewa Mawatha', 'Walana', 'Panadura', 'Western', '971284749V', 'achirafernando97@gmail.com'),
        new Donor('357', 'Yasas', 'Fernando', '1005', 'E+', 23, 778485864, '18 Podusewa Mawatha', 'Walana', 'Panadura', 'Western', '971284749V', 'achirafernando97@gmail.com'),
    ]

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

export class Donor extends UserProfile {
    constructor(
        uid: string,
        firstname: string,
        surname: string,
        bloodBankDonorId: string,
        bloodGroup: string,
        age: number,
        mobileNumber: number,
        addressLine1: string,
        addressLine2: string,
        city: string,
        province: string,
        nicNumber: string,
        emailAddress: string,
    ) {
        super();
        this.uid = uid;
        this.firstname = firstname;
        this.surname = surname;
        this.bloodBankDonorId = bloodBankDonorId;
        this.bloodGroup = bloodGroup;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.province = province;
        this.nicNumber = nicNumber;
        this.emailAddress = emailAddress;
    }
}