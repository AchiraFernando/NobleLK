import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    public registerForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            username: ['', Validators.required],
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
    get username(): AbstractControl {
        return this.registerForm.get('username');
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

    ngOnInit() {
    }

    registerClick() {

    }

}
