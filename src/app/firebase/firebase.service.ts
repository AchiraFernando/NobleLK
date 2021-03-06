import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { BloodRequest } from '../models/blood-request.model';
import { BloodBankDonor } from '../models/blood-bank-donor.model';

@Injectable({
    providedIn: 'root'
})
export class FireBaseService {

    public userProfiles: UserProfile[] = [];
    public bloodBankDonors: BloodBankDonor[] = [];

    private _userProfilesChanged: Subject<UserProfile[]> = new Subject();
    public userProfileChanged: Observable<UserProfile[]> = this._userProfilesChanged.asObservable();

    private _bloodBankDonorsChanged: Subject<BloodBankDonor[]> = new Subject();
    public bloodBankDonorsChanged: Observable<BloodBankDonor[]> = this._bloodBankDonorsChanged.asObservable();

    public bloodRequest: BloodRequest;

    constructor(
        private angularFirestore: AngularFirestore
    ) {}

    createProfile(userProfile: UserProfile){
        return this.angularFirestore.collection('profiles').doc(userProfile.uid).set((Object.assign({}, userProfile)));
    }

    updateProfile(userProfile: UserProfile) {
        const userId: string = userProfile.uid;
        delete userProfile.uid;
        return this.angularFirestore.collection('profiles').doc(userId).update((Object.assign({}, userProfile)));
    }

    getProfile(uid: string) {
        const docRef = this.angularFirestore.collection('profiles').doc(uid);

        return docRef.ref.get().then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                throw new Error('Failed to find the donor profile!');
            }
        }).catch((error) => {
            throw new Error('Failed to fetch the donor profile!');
        });
    }

    createBloodRequest(bloodRequest: BloodRequest) {
        return this.angularFirestore.collection('requests').doc(bloodRequest.requestId).set((Object.assign({}, bloodRequest)));
    }

    getBloodRequest(requestId: string) {
        const docRef = this.angularFirestore.collection('requests').doc(requestId);

        return docRef.ref.get().then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                throw new Error('Failed to find the request details!');
            }
        }).catch((error) => {
            throw new Error('Failed to fetch the request details!');
        });
    }

    public fetchDonorProfiles() {
        this.angularFirestore.collection('profiles').valueChanges().subscribe((profile) => {
            this.userProfiles = profile as UserProfile[];
            this._userProfilesChanged.next(this.userProfiles);
        });
    }

    public fetchBloodBankDonors() {
        this.angularFirestore.collection('bloodBankDonors').valueChanges().subscribe((donor) => {
            this.bloodBankDonors = donor as BloodBankDonor[];
            this._bloodBankDonorsChanged.next(this.bloodBankDonors);
        });
    }


}
