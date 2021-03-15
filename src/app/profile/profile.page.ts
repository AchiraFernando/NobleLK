import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    public profileForm: FormGroup;

    public isEdit: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
    ) {
        this.profileForm = this.formBuilder.group({
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
        });
    }

    get firstName(): AbstractControl {
        return this.profileForm.get('firstName');
    }
    get surname(): AbstractControl {
        return this.profileForm.get('surname');
    }
    get username(): AbstractControl {
        return this.profileForm.get('username');
    }
    get donorId(): AbstractControl {
        return this.profileForm.get('donorId');
    }
    get bloodGroup(): AbstractControl {
        return this.profileForm.get('bloodGroup');
    }
    get age(): AbstractControl {
        return this.profileForm.get('age');
    }
    get mobileNumber(): AbstractControl {
        return this.profileForm.get('mobileNumber');
    }
    get addressLine1(): AbstractControl {
        return this.profileForm.get('addressLine1');
    }
    get addressLine2(): AbstractControl {
        return this.profileForm.get('addressLine2');
    }
    get city(): AbstractControl {
        return this.profileForm.get('city');
    }
    get province(): AbstractControl {
        return this.profileForm.get('province');
    }
    get nicNumber(): AbstractControl {
        return this.profileForm.get('nicNumber');
    }
    get emailAddress(): AbstractControl {
        return this.profileForm.get('emailAddress');
    }

    ngOnInit() {
    }

    submitClick() {
        this.isEdit = false;
        this.profileForm.reset('valid');
    }

}

