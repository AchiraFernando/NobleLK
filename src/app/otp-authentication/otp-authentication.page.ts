import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import firebase from "firebase";

import { AuthenticationService } from '../authentication/authentication.service';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-otp-authentication',
    templateUrl: './otp-authentication.page.html',
    styleUrls: ['./otp-authentication.page.scss'],
})
export class OtpAuthenticationPage implements OnInit {

    public otpForm: FormGroup;
    private applicationVerifier: firebase.auth.ApplicationVerifier;
    public otpSent: boolean;
    public confirmationResult: firebase.auth.ConfirmationResult;
    public sentCount = 0;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private modalController: ModalController,
        private toastService: ToastService,
        private loadingController: LoadingController,
    ) {
        this.otpForm = this.formBuilder.group({
            phoneNumber: ['', Validators.required],
            code: ['', Validators.required],
        });
    }

    get phoneNumber(): AbstractControl {
        return this.otpForm.get('phoneNumber');
    }
    get code(): AbstractControl {
        return this.otpForm.get('code');
    }

    ngAfterViewInit() {
        this.applicationVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
            size: "invisible"
            }
        );
    }

    ngOnInit() {
    }

    public async sendOTP() {
        this.sentCount++;
        let sendingLoader = this.loadingController.create({
            message: "Sending..."
        });

        (await sendingLoader).present();

        let strPhoneNumber = '+' + this.phoneNumber.value.toString();
        this.authenticationService.authenticatePhoneNumber(strPhoneNumber, this.applicationVerifier).then(async (result) => {
            this.otpSent = true;
            this.confirmationResult = result;
            (await sendingLoader).dismiss();
            this.toastService.generateToast('OTP code sent!', 3000);
        }).catch(async (error) => {
            (await sendingLoader).dismiss();
            console.log(error);
            this.toastService.generateToast(error, 5000);
        });
    }

    public async verifyOTP() {
        let verifyingLoader = this.loadingController.create({
            message: "Sending..."
        });

        (await verifyingLoader).present();

        let strOtp = this.code.value.toString();
        this.confirmationResult.confirm(strOtp).then(async () => {
            (await verifyingLoader).dismiss();
            this.modalController.dismiss({
                'verified': true,
            });
        }).catch(async (error) => {
            (await verifyingLoader).dismiss();
            console.log(error);
            this.toastService.generateToast(error, 5000);
        });
    }

    public closeModal(): void {
        this.modalController.dismiss({
            'verified': false,
        });
    }

    public getSendText(): string {
        if (this.sentCount === 0) return 'Send OTP';
        else return 'Resend OTP';
    }



}
