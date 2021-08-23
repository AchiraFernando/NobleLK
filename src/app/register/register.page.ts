import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
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

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
        private router: Router,
    ) {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
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
    get addressLine1(): AbstractControl {
        return this.registerForm.get('addressLine1');
    }
    get addressLine2(): AbstractControl {
        return this.registerForm.get('addressLine2');
    }
    get city(): AbstractControl {
        return this.registerForm.get('city');
    }
    get province(): AbstractControl {
        return this.registerForm.get('province');
    }
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

    locationOnChange(coordinates: google.maps.LatLng) {
        this.currentCoordinates = coordinates;
    }

    ngOnInit() {}

    public registerClick() {
        if (!this.fireBaseService.bloodBankDonors.find((donor) => donor.donorId === this.donorId.value)) {
            this.toastService.generateToast('You must be registered in the Blood Bank in-order to proceed', 5000);
            return;
        }
        this.signUp(this.emailAddress.value, this.password.value);
    }

    private async signUp(email: string, password: string) {
        (await this.registeringLoader).present();

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
        donorProfile.addressLine1 = this.addressLine1.value;
        donorProfile.addressLine2 = this.addressLine2.value;
        donorProfile.city = this.city.value;
        donorProfile.province = this.province.value;
        donorProfile.nicNumber = this.nicNumber.value;
        donorProfile.emailAddress = this.emailAddress.value;
        donorProfile.latitude = this.currentCoordinates.lat();
        donorProfile.longitude = this.currentCoordinates.lng();

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
    }

    public confirmPassword(): boolean {
        return this.password.value !== this.reEnterPassword.value;
    }

}
