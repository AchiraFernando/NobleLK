import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Config, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { FileUploadService } from '../file-upload.service';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    public registerForm: FormGroup;

    private registeringLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Donor Registering...'
    });
    private profileCreatingLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Profile Creating...'
    });
    private profilePictureLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading Profile Picture...'
    });

    // Variable to store imageLink from api response
    imageLink = '';
    imageFile: File = null; // Variable to store image file
    imageToShow: any;
    nextDonationDate: string = null;
    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
        private router: Router,
        private fileUploadService: FileUploadService
    ) {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
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
            password: ['', Validators.required],
            reEnterPassword: ['', Validators.required],
        });

        this.fireBaseService.fetchBloodBankDonors();
    }

    get firstName(): AbstractControl {
        return this.registerForm.get('firstName');
    }
    get surname(): AbstractControl {
        return this.registerForm.get('surname');
    }
    get donorId(): AbstractControl {
        return this.registerForm.get('donorId');
    }
    get bloodGroup(): AbstractControl {
        return this.registerForm.get('bloodGroup');
    }
    get age(): AbstractControl {
        return this.registerForm.get('age');
    }
    get mobileNumber(): AbstractControl {
        return this.registerForm.get('mobileNumber');
    }
    // get addressLine1(): AbstractControl {
    //     return this.registerForm.get('addressLine1');
    // }
    // get addressLine2(): AbstractControl {
    //     return this.registerForm.get('addressLine2');
    // }
    get city(): AbstractControl {
        return this.registerForm.get('city');
    }
    // get province(): AbstractControl {
    //     return this.registerForm.get('province');
    // }
    get nicNumber(): AbstractControl {
        return this.registerForm.get('nicNumber');
    }
    get emailAddress(): AbstractControl {
        return this.registerForm.get('emailAddress');
    }
    get password(): AbstractControl {
        return this.registerForm.get('password');
    }
    get reEnterPassword(): AbstractControl {
        return this.registerForm.get('reEnterPassword');
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

    ngOnInit() { }

    public registerClick() {
        if (!this.fireBaseService.bloodBankDonors.find((donor) => donor.donorId === this.donorId.value)) {
            this.toastService.generateToast('You must be registered in the Blood Bank in-order to proceed', 5000);
            return;
        }
        this.signUp(this.emailAddress.value, this.password.value);
    }

    private async signUp(email: string, password: string) {
        (await this.registeringLoader).present();

        if (this.nextDonationDate === null) {
            this.toastService.generateToast('Next donation date is required', 3000);
            (await this.profileCreatingLoader).dismiss();
            return;
        }

        if (!this.validateBeforeSubmit()) {
            this.toastService.generateToast('Incomplete details, please complete all the details', 5000);
            return
        }

        this.authenticationService.registerUser(email, password)
            .then(async (res) => {
                console.log('user: ', res.user.uid);
                (await this.registeringLoader).dismiss();
                this.createDonorProfile(res.user.uid);
            }).catch(async (error) => {
                (await this.registeringLoader).dismiss();
                console.log(error.message);
                this.toastService.generateToast(error.message, 5000);
            }
        );
    }

    private async createDonorProfile(uid: string) {
        (await this.profileCreatingLoader).present();
        let donorProfile: UserProfile = new UserProfile();
        donorProfile.uid = uid;
        donorProfile.firstname = this.firstName.value;
        donorProfile.surname = this.surname.value;
        donorProfile.bloodBankDonorId = this.donorId.value;
        donorProfile.bloodGroup = this.bloodGroup.value;
        donorProfile.age = this.age.value;
        donorProfile.mobileNumber = this.mobileNumber.value;
        donorProfile.city = this.city.value;
        donorProfile.nicNumber = this.nicNumber.value;
        donorProfile.emailAddress = this.emailAddress.value;
        donorProfile.latitude = this.currentCoordinates.lat();
        donorProfile.longitude = this.currentCoordinates.lng();
        donorProfile.nextDonationDate = this.nextDonationDate;

        this.uploadProfilePicture(donorProfile.uid).then(
            async (imageUrl) => {
                donorProfile.profilePicture = imageUrl;
                this.fireBaseService.createProfile(donorProfile)
                    .then(async (res) => {
                        (await this.profileCreatingLoader).dismiss();
                        this.router.navigate(['login']);
                        this.toastService.generateToast('Registration successful!', 5000);
                    }).catch(async (error) => {
                        (await this.profileCreatingLoader).dismiss();
                        console.error(error);
                        this.toastService.generateToast('Error occured when registering', 5000);
                    });
            }).catch(async (error) => {
                (await this.profileCreatingLoader).dismiss();
                this.toastService.generateToast('Error occured when registering', 5000);
            });
    }

    validateBeforeSubmit() {
        if (
            !this.firstName.value ||
            !this.surname.value ||
            !this.donorId.value ||
            !this.bloodGroup.value ||
            !this.age.value ||
            !this.mobileNumber.value ||
            !this.city.value ||
            !this.nicNumber.value ||
            !this.emailAddress.value ||
            !this.currentCoordinates.lat() ||
            !this.currentCoordinates.lng() ||
            !this.nextDonationDate
        ) {
            return false;
        }
        return true;
    }

    public confirmPassword(): boolean {
        return this.password.value !== this.reEnterPassword.value;
    }

    nextDonationDateChange(event) {
        this.nextDonationDate = event.target.value;
    }

}
