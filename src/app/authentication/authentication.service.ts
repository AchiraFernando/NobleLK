import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { Subject, Observable } from "rxjs";
import { UserProfile } from "../models/user-profile.model";
import { User } from "../models/user.model";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    userData: any;

    private _userDataChanged: Subject<any> = new Subject();
    public userDataChanged: Observable<any> = this._userDataChanged.asObservable();

    constructor(
        private angularFireStore: AngularFirestore,
        private angularFireAuth: AngularFireAuth,
        private router: Router,
        private ngZone: NgZone,
    ) {
        this.angularFireAuth.authState.subscribe(user => {
            let currUser = JSON.parse(localStorage.getItem('user')) as User;
            if (user) {
                this.userData = user;
                localStorage.setItem('user', JSON.stringify(this.userData));
                if (!currUser || currUser.uid !== user['uid']) this._userDataChanged.next();
            } else {
                localStorage.setItem('user', null);
            }
        });
    }

    public get currentUser(): User {
        return JSON.parse(localStorage.getItem('user'));
    }

    // login in with email/password
    public signIn(email: string, password: string) {
        return this.angularFireAuth.signInWithEmailAndPassword(email, password);
    }

    // register user with email/password
    public registerUser(email: string, password: string) {
        return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
    }

    // email verification when new user register
    public sendVerificationEmail() {
        return this.angularFireAuth.currentUser.then(u => u.sendEmailVerification())
            .then(() => {
                this.router.navigate(['verify-email']);
            });
    }

    // recover password
    public passwordRecover(passwordResetEmail) {
        return this.angularFireAuth.sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email has been sent, please check your inbox');
            }).catch((error) => {
                window.alert(error);
        });
    }

    // returns true when user is logged in
    public get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user !== null && user.emailVerified !== false) ? true : false;
    }

    // returns true when user's email is verified
    public get isEmailVerified(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (user.emailVerified !== false) ? true : false;
    }

    // store user in localstorage
    public setUserData(user: User) {
        const userRef: AngularFirestoreDocument<User> = this.angularFireStore.doc(`users/${user.uid}`);
        const userData: User = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
        }
        return userRef.set(userData, {
            merge: true,
        });
    }

    // sign-out
    public signOut() {
        return this.angularFireAuth.signOut().then(() => {
            localStorage.removeItem('user');
            this.router.navigate(['startup']);
        });
    }

}