import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
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
    }

    forgotPasswordClick() {
        console.log('forgot password clicked!');
    }

    registerClick() {
        console.log('register clicked!');
    }

    public async loginClick() {
        let loader = this.loadingController.create({
            message: 'Loading...'
        });

        (await loader).present();

        this.authenticationService.signIn(this.email.value, this.password.value)
            .then(async (res) => {
                //verify login through email or phone number
                this.toastService.generateToast('Login Successful!', 3000);
                (await loader).dismiss();
                this.router.navigate(['profile']);
            }).catch(async (error) => {
                console.log(error.message);
                (await loader).dismiss();
                this.toastService.generateToast(error, 3000);
            });
    }

}
