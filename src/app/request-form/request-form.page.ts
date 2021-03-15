import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.page.html',
    styleUrls: ['./request-form.page.scss'],
})
export class RequestFormPage implements OnInit {

    public requestForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
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

    public submitRequest() {

    }

}
