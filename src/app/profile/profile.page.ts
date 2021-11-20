import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from '../cache.service';
import { DonationReminderComponent } from '../components/donation-reminder/donation-reminder.component';
import { FileUploadService } from '../file-upload.service';
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

    // Variable to store imageLink from api response
    imageLink = '';
    imageFile: File = null; // Variable to store image file
    imageToShow: any = null;

    public nextDonationDate = null;

    public get currentDonorProfile(): UserProfile {
        return this.cacheService.userProfile;
    }

    private profileLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Profile...'
    });
    private updateProfileLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Profile Updating...'
    });
    private profileCreatingLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Profile Creating...'
    });
    private profilePictureLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Profile Picture...'
    });

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
        private cacheService: CacheService,
        private fileUploadService: FileUploadService,
        private modalController: ModalController,
    ) {
        this.profileForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            // username: ['', Validators.required],
            donorId: ['', Validators.required],
            bloodGroup: ['', Validators.required],
            age: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            // addressLine1: ['', Validators.required],
            // addressLine2: [''],
            city: ['', Validators.required],
            // province: ['', Validators.required],
            nicNumber: ['', Validators.required],
            emailAddress: ['', Validators.required],
        });

        this.loadProfile();

        this.cacheService.userProfileChanged.subscribe((userProfile: UserProfile) => {
            this.currentCoordinates = new google.maps.LatLng(userProfile.latitude, userProfile.longitude);
        });
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
    // get addressLine1(): AbstractControl {
    //     return this.profileForm.get('addressLine1');
    // }
    // get addressLine2(): AbstractControl {
    //     return this.profileForm.get('addressLine2');
    // }
    get city(): AbstractControl {
        return this.profileForm.get('city');
    }
    // get province(): AbstractControl {
    //     return this.profileForm.get('province');
    // }
    get nicNumber(): AbstractControl {
        return this.profileForm.get('nicNumber');
    }
    get emailAddress(): AbstractControl {
        return this.profileForm.get('emailAddress');
    }

    _currentCoordinates: google.maps.LatLng;
    public get currentCoordinates(): google.maps.LatLng {
        return this._currentCoordinates;
    }
    public set currentCoordinates(coordinates: google.maps.LatLng) {
        this._currentCoordinates = coordinates;
    }

    public async onImageChange(event) {
        this.imageFile = event.target.files[0];
        (await this.profilePictureLoader).present();

        const reader = new FileReader();
        reader.onload = () => {
            this.imageToShow = reader.result as string;
        };
        reader.readAsDataURL(this.imageFile);

        (await this.profilePictureLoader).dismiss();
    }

    async uploadProfilePicture(id: string): Promise<any> {
        if (!this.imageFile) {
            this.toastService.generateToast('Please attach a profile picture', 5000);
            throw new Error();
        }
        return await this.fileUploadService.uploadToFireStorage(this.imageFile, id, 'profile-pictures');
    }


    locationOnChange(coordinates: google.maps.LatLng) {
        this.currentCoordinates = coordinates;
    }

    private async loadProfile() {
        let donor: User = this.authenticationService.currentUser;
        if (!donor) return;

        (await this.profileLoader).present();

        this.fireBaseService.getProfile(donor.uid).then(async (userProfile: UserProfile) => {
            this.cacheService.loadUserProfile(userProfile);
            this.initializeProfile();
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
        // this.addressLine1.setValue(this.currentDonorProfile.addressLine1);
        // this.addressLine2.setValue(this.currentDonorProfile.addressLine2);
        this.city.setValue(this.currentDonorProfile.city);
        // this.province.setValue(this.currentDonorProfile.province);
        this.nicNumber.setValue(this.currentDonorProfile.nicNumber);
        this.emailAddress.setValue(this.currentDonorProfile.emailAddress);
        this.imageLink = this.currentDonorProfile.profilePicture;
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
        // donorProfile.addressLine1 = this.addressLine1.value;
        // donorProfile.addressLine2 = this.addressLine2.value;
        donorProfile.city = this.city.value;
        // donorProfile.province = this.province.value;
        donorProfile.nicNumber = this.nicNumber.value;
        donorProfile.emailAddress = this.emailAddress.value;
        donorProfile.latitude = this.currentCoordinates.lat();
        donorProfile.longitude = this.currentCoordinates.lng();
        donorProfile.longitude = this.currentCoordinates.lng();
        donorProfile.nextDonationDate = this.nextDonationDate;
        donorProfile.previousDonationDate = this.currentDonorProfile.nextDonationDate;

        if (this.imageToShow !== null) {
            this.uploadProfilePicture(donorProfile.uid).then(
                async (imageUrl) => {
                    donorProfile.profilePicture = imageUrl;
                    this.fireBaseService.updateProfile(donorProfile).then(async () => {
                        (await this.updateProfileLoader).dismiss();
                        this.loadProfile();
                        this.toastService.generateToast('Profile updated successfully!', 3000);
                    }).catch(async () => {
                        (await this.updateProfileLoader).dismiss();
                        this.toastService.generateToast('Error updating profile', 5000);
                    });
                }).catch(async (error) => {
                    (await this.updateProfileLoader).dismiss();
                    this.toastService.generateToast(`Error occured when updating profile - ${error}`, 5000);
                });
        } else {
            this.fireBaseService.updateProfile(donorProfile).then(async () => {
                (await this.updateProfileLoader).dismiss();
                this.loadProfile();
                this.toastService.generateToast('Profile updated successfully!', 3000);
            }).catch(async () => {
                (await this.updateProfileLoader).dismiss();
                this.toastService.generateToast('Error updating profile', 5000);
            });
        }

        this.isEdit = false;
        this.imageToShow = null;
        this.profileForm.reset('valid');
    }

    public async presentReminderModal() {
        const modal = await this.modalController.create({
        component: DonationReminderComponent,
            cssClass: 'my-custom-class'
        });

        await modal.present();

        return modal.onDidDismiss();
    }

    public async setReminderClick() {
        await this.presentReminderModal();
    }

    public resetClick() {
        this.initializeProfile();
        this.isEdit = false;
        this.imageToShow = null;
        this.profileForm.reset('valid');
    }

    public editClick() {
        this.initializeProfile();
        this.isEdit = true;
    }

    public disableSubmit() {
        if (this.imageToShow !== null) {
            return false;
        }
        return !this.profileForm.valid;
    }

    nextDonationDateChange(event) {
        this.nextDonationDate = event.target.value;
    }
}

