import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { FireBaseService } from '../firebase/firebase.service';
import { UserProfile } from '../models/user-profile.model';
import { User } from '../models/user.model';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    public registerForm: FormGroup;

    private loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Loading...'
    });

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private authenticationService: AuthenticationService,
        private fireBaseService: FireBaseService,
    ) {
        this.registerForm = this.formBuilder.group({
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
            password: ['', Validators.required],
            reEnterPassword: ['', Validators.required],
        });
    }

    get firstName(): AbstractControl {
        return this.registerForm.get('firstName');
    }
    get surname(): AbstractControl {
        return this.registerForm.get('surname');
    }
    // get username(): AbstractControl {
    //     return this.registerForm.get('username');
    // }
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

    ngOnInit() {
        this.authenticationService.userDataChanged.subscribe(() => {
            //create the user profile here
            this.createDonorProfile();
        });
    }

    public registerClick() {
        this.signUp(this.emailAddress.value, this.password.value);
    }

    private async signUp(email: string, password: string) {
        (await this.loader).present();

        this.authenticationService.registerUser(email, password)
            .then((res) => {
                //Do something here
            }).catch(async (error) => {
                (await this.loader).dismiss();
                console.log(error.message)
                this.toastService.generateToast('Error occured when registering', 5000);
            }
        );
    }

    private async createDonorProfile() {
        let currentUser: User = this.authenticationService.currentUser;
        if (!currentUser) return;
        let donorProfile: UserProfile = new UserProfile();
        donorProfile.uid = currentUser.uid;
        // donorProfile.username = this.username.value;
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

        this.fireBaseService.createProfile(donorProfile)
            .then(async (res) => {
                (await this.loader).dismiss();
                this.toastService.generateToast('Donor registered successfully!', 3000);
            }).catch(async (error) => {
                (await this.loader).dismiss();
                console.error(error);
                this.toastService.generateToast('Error occured when registering', 5000);
            })
    }

    public confirmPassword(): boolean {
        return this.password.value !== this.reEnterPassword.value;
    }

}
