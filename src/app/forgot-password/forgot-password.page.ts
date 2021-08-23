import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

    public resetForm: FormGroup;

    get email(): AbstractControl {
        return this.resetForm.get('email');
    }

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private authenticationService: AuthenticationService,
        private loadingController: LoadingController,
    ) {
        this.resetForm = this.formBuilder.group({
            email: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    public async resetClick() {
        let loader = this.loadingController.create({
            message: 'Loading...'
        });

        (await loader).present();

        this.authenticationService.passwordRecover(this.email.value)
            .then(async (user) => {
                (await loader).dismiss();
                this.toastService.generateToast('Password reset email has been sent, please check your inbox', 3000);
            }).catch(async (error) => {
                console.log(error.message);
                (await loader).dismiss();
                this.toastService.generateToast(error, 3000);
            });

    }

}
