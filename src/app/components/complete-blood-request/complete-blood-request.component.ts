import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from 'src/app/firebase/firebase.service';
import { BloodRequest } from 'src/app/models/blood-request.model';
import { ToastService } from 'src/app/toast-service/toast.service';

@Component({
  selector: 'app-complete-blood-request',
  templateUrl: './complete-blood-request.component.html',
  styleUrls: ['./complete-blood-request.component.scss'],
})
export class CompleteBloodRequestComponent implements OnInit {

    public requestForm: FormGroup;

    public request: BloodRequest;

    public _completeRequestToggle: boolean = false;

    private completingRequestLoader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
        message: 'Completing Request...'
    });

    completeRequestToggle() {
        this._completeRequestToggle = !this._completeRequestToggle;
    }

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private loadingController: LoadingController,
        private firebaseService: FireBaseService,
    ) {
        this.requestForm = this.formBuilder.group({
            nicNumber: ['', Validators.required],
            emailAddress: ['', Validators.required],
        });
    }

    get nicNumber(): AbstractControl {
        return this.requestForm.get('nicNumber');
    }
    get emailAddress(): AbstractControl {
        return this.requestForm.get('emailAddress');
    }

    ngOnInit() { }

    public call(): string {
        if (!this.request) { return; }
        return `tel:+94${this.request.mobileNumber}`;
    }

    public async completeClick() {
        (await this.completingRequestLoader).present();
        if (this.request.nicNumber !== this.nicNumber.value) {
            this.toastService.generateToast('Incorrect NIC, try again.', 5000);
            (await this.completingRequestLoader).dismiss();
            return;
        }
        if (this.request.emailAddress !== this.emailAddress.value) {
            this.toastService.generateToast('Incorrect Email Address, try again.', 5000);
            (await this.completingRequestLoader).dismiss();
            return;
        }
        this.firebaseService.removeBloodRequest(this.request.requestId)
            .then(async () => {
                this.toastService.generateToast('Request completed successfully.', 3000);
                (await this.completingRequestLoader).dismiss();
            })
            .catch(async () => {
                this.toastService.generateToast('Error completing the request, try again later.', 5000);
                (await this.completingRequestLoader).dismiss();
            });
    }

    public disableSubmit() {
        return !this.requestForm.valid;
    }

}
