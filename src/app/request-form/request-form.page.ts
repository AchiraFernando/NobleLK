import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { FireBaseService } from '../firebase/firebase.service';
import { BloodRequest } from '../models/blood-request.model';
import { ToastService } from '../toast-service/toast.service';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.page.html',
    styleUrls: ['./request-form.page.scss'],
})
export class RequestFormPage implements OnInit {

    public requestForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private fireBaseService: FireBaseService,
        private loadingController: LoadingController,
        private toastService: ToastService,
        private router: Router,
    ) {
        this.requestForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            bloodGroup: ['', Validators.required],
            numberOfUnits: ['', Validators.required],
            age: ['', Validators.required],
            nicNumber: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            city: ['', Validators.required],
            province: ['', Validators.required],
            emailAddress: ['', Validators.required],
        });
    }

    get firstName(): AbstractControl {
        return this.requestForm.get('firstName');
    }
    get surname(): AbstractControl {
        return this.requestForm.get('surname');
    }
    get bloodGroup(): AbstractControl {
        return this.requestForm.get('bloodGroup');
    }
    get numberOfUnits(): AbstractControl {
        return this.requestForm.get('numberOfUnits');
    }
    get age(): AbstractControl {
        return this.requestForm.get('age');
    }
    get nicNumber(): AbstractControl {
        return this.requestForm.get('nicNumber');
    }
    get mobileNumber(): AbstractControl {
        return this.requestForm.get('mobileNumber');
    }
    get addressLine1(): AbstractControl {
        return this.requestForm.get('addressLine1');
    }
    get addressLine2(): AbstractControl {
        return this.requestForm.get('addressLine2');
    }
    get city(): AbstractControl {
        return this.requestForm.get('city');
    }
    get province(): AbstractControl {
        return this.requestForm.get('province');
    }
    get emailAddress(): AbstractControl {
        return this.requestForm.get('emailAddress');
    }

    ngOnInit() {
    }

    public async submitRequest() {
        let loader: Promise<HTMLIonLoadingElement> = this.loadingController.create({
            message: 'Loading...'
        });

        (await loader).present();

        let request: BloodRequest = new BloodRequest();
        request.firstname = this.firstName.value;
        request.surname = this.surname.value;
        request.numberOfUnits = this.numberOfUnits.value;
        request.bloodGroup = this.bloodGroup.value;
        request.age = this.age.value;
        request.mobileNumber = this.mobileNumber.value;
        request.addressLine1 = this.addressLine1.value;
        request.addressLine2 = this.addressLine2.value;
        request.city = this.city.value;
        request.province = this.province.value;
        request.nicNumber = this.nicNumber.value;
        request.emailAddress = this.emailAddress.value;

        this.fireBaseService.createBloodRequest(request)
            .then(async (res) => {
                (await loader).dismiss();
                this.toastService.generateToast('Request successfull!', 3000);
                this.router.navigate(['registered-donors']);
            }).catch(async (error) => {
                (await loader).dismiss();
                console.error(error);
                this.toastService.generateToast('Error occured when requesting', 5000);
            })
    }

}
