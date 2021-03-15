import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    get username(): AbstractControl {
        return this.loginForm.get('username');
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

    loginClick() {
        console.log(this.loginForm.value);
    }

}
