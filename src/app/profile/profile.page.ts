import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from '../cache.service';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';
import { User } from '../models/user.model';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

    public profileForm: FormGroup;

    public isEdit: boolean = false;

    public get currentDonorProfile(): UserProfile {
        return this.cacheService.userProfile;
    }

    private profileLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Profile...'
    });
    private updateProfileLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Profile Updating...'
    });

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
        private cacheService: CacheService,
    ) {
        this.profileForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            // username: ['', Validators.required],
            donorId: ['', Validators.required],
            bloodGroup: ['', Validators.required],
            age: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            city: ['', Validators.required],
            province: ['', Validators.required],
            nicNumber: ['', Validators.required],
            emailAddress: ['', Validators.required],
        });

        this.loadProfile();
    }

    get firstName(): AbstractControl {
        return this.profileForm.get('firstName');
    }
    get surname(): AbstractControl {
        return this.profileForm.get('surname');
    }
    // get username(): AbstractControl {
    //     return this.profileForm.get('username');
    // }
    get donorId(): AbstractControl {
        return this.profileForm.get('donorId');
    }
    get bloodGroup(): AbstractControl {
        return this.profileForm.get('bloodGroup');
    }
    get age(): AbstractControl {
        return this.profileForm.get('age');
    }
    get mobileNumber(): AbstractControl {
        return this.profileForm.get('mobileNumber');
    }
    get addressLine1(): AbstractControl {
        return this.profileForm.get('addressLine1');
    }
    get addressLine2(): AbstractControl {
        return this.profileForm.get('addressLine2');
    }
    get city(): AbstractControl {
        return this.profileForm.get('city');
    }
    get province(): AbstractControl {
        return this.profileForm.get('province');
    }
    get nicNumber(): AbstractControl {
        return this.profileForm.get('nicNumber');
    }
    get emailAddress(): AbstractControl {
        return this.profileForm.get('emailAddress');
    }

    private async loadProfile() {
        let donor: User = this.authenticationService.currentUser;
        if (!donor) return;

        (await this.profileLoader).present();

        this.fireBaseService.getProfile(donor.uid).then(async (userProfile: UserProfile) => {
            this.initializeProfile();
            this.cacheService.loadUserProfile(userProfile);
            (await this.profileLoader).dismiss();
        }).catch(async (error) => {
            this.toastService.generateToast(error, 5000);
            (await this.profileLoader).dismiss();
        });
    }

    private initializeProfile(): void {
        if (!this.currentDonorProfile) return;
        this.firstName.setValue(this.currentDonorProfile.firstname);
        this.surname.setValue(this.currentDonorProfile.surname);
        this.donorId.setValue(this.currentDonorProfile.bloodBankDonorId);
        this.bloodGroup.setValue(this.currentDonorProfile.bloodGroup);
        this.age.setValue(this.currentDonorProfile.age);
        this.mobileNumber.setValue(this.currentDonorProfile.mobileNumber);
        this.addressLine1.setValue(this.currentDonorProfile.addressLine1);
        this.addressLine2.setValue(this.currentDonorProfile.addressLine2);
        this.city.setValue(this.currentDonorProfile.city);
        this.province.setValue(this.currentDonorProfile.province);
        this.nicNumber.setValue(this.currentDonorProfile.nicNumber);
        this.emailAddress.setValue(this.currentDonorProfile.emailAddress);
    }

    public buildAddress(): string {
        if (!this.currentDonorProfile) return '';
        return `${this.currentDonorProfile.addressLine1}, ${this.currentDonorProfile.addressLine2}`;
    }

    public async submitClick() {
        let currentUser: User = this.authenticationService.currentUser;
        if (!currentUser) return;

        (await this.updateProfileLoader).present();

        let donorProfile: UserProfile = new UserProfile();
        donorProfile.uid = currentUser.uid;
        donorProfile.firstname = this.firstName.value;
        donorProfile.surname = this.surname.value;
        donorProfile.bloodBankDonorId = this.donorId.value;
        donorProfile.bloodGroup = this.bloodGroup.value;
        donorProfile.age = this.age.value;
        donorProfile.mobileNumber = this.mobileNumber.value;
        donorProfile.addressLine1 = this.addressLine1.value;
        donorProfile.addressLine2 = this.addressLine2.value;
        donorProfile.city = this.city.value;
        donorProfile.province = this.province.value;
        donorProfile.nicNumber = this.nicNumber.value;
        donorProfile.emailAddress = this.emailAddress.value;

        this.fireBaseService.updateProfile(donorProfile).then(async () => {
            (await this.updateProfileLoader).dismiss();
            this.loadProfile();
            this.toastService.generateToast('Profile updated successfully!', 3000);
        }).catch(async () => {
            (await this.updateProfileLoader).dismiss();
            this.toastService.generateToast('Error updating profile', 5000);
        });

        this.isEdit = false;
        this.profileForm.reset('valid');
    }

    public resetClick() {
        this.initializeProfile();
        this.isEdit = false;
        this.profileForm.reset('valid');
    }

    public editClick() {
        this.initializeProfile();
        this.isEdit = true;
    }

}

