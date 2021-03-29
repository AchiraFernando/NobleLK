import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserProfile } from "../models/user-profile.model";
import { AngularFirestore } from '@angular/fire/firestore'
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FireBaseService {
    constructor(
        private angularFirestore: AngularFirestore
    ) {}

    createProfile(userProfile: UserProfile){
        return this.angularFirestore.collection('profiles').doc(userProfile.uid).set((Object.assign({}, userProfile)));
    }

    updateProfile(userProfile: UserProfile) {
        let userId: string = userProfile.uid;
        delete userProfile.uid;
        return this.angularFirestore.collection('profiles').doc(userId).update((Object.assign({}, userProfile)));
    }

    getProfile(uid: string) {
        const docRef = this.angularFirestore.collection("profiles").doc(uid);

        return docRef.ref.get().then((doc) => {
            if (doc.exists) {
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                throw new Error("Failed to find the donor profile!");
            }
        }).catch((error) => {
            throw new Error("Failed to fetch the donor profile!");
        });
    }

}