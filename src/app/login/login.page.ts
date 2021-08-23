import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { OtpAuthenticationPage } from '../otp-authentication/otp-authentication.page';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private authenticationService: AuthenticationService,
        private loadingController: LoadingController,
        private router: Router,
        private navCtrl: NavController,
        private modalController: ModalController,
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    get email(): AbstractControl {
        return this.loginForm.get('email');
    }
    get password(): AbstractControl {
        return this.loginForm.get('password');
    }

    ngOnInit() {
        this.checkUserLoggedIn();
    }

    public async presentModal() {
        const modal = await this.modalController.create({
        component: OtpAuthenticationPage,
            cssClass: 'my-custom-class'
        });

        await modal.present();

        return modal.onDidDismiss();
    }

    private async checkUserLoggedIn() {
        if (this.authenticationService.isLoggedIn) {
            const loader = this.loadingController.create({
                message: 'Logging in...',
                duration: 3000,
            });

            (await loader).present().then(() => {
                this.router.navigate(['profile']);
            });
        }
    }

    forgotPasswordClick() {
        console.log('forgot password clicked!');
    }

    public async loginClick() {
        const loader = this.loadingController.create({
            message: 'Loading...'
        });

        (await loader).present();

        this.authenticationService.signIn(this.email.value, this.password.value)
            .then(async (user) => {
                (await loader).dismiss();
                // verify login through email or phone number
                const isEmailVerified: boolean = await this.authenticationService.isEmailVerified();
                if (!isEmailVerified) {
                    this.authenticationService.sendVerificationEmail().then(async () => {
                        this.toastService.generateToast('Login Failed, Please check your mail to verify the donor before login.', 5000);
                        (await loader).dismiss();
                    });
                    return;
                }
                this.presentModal().then((event) => {
                    if (event && event.data) {
                        const isVerified: boolean = event.data['verified'];
                        if (isVerified) {
                            this.authenticationService.saveUserLocally(user);
                            this.toastService.generateToast('Login Successful!', 3000);
                            this.navCtrl.navigateBack('/profile');
                        }
                    }
                });
            }).catch(async (error) => {
                console.log(error.message);
                (await loader).dismiss();
                this.toastService.generateToast(error, 3000);
            });

    }

}