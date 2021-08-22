import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { BloodRequest } from "./models/blood-request.model";
import { UserProfile } from "./models/user-profile.model";
import { User } from "./models/user.model";

@Injectable({
  providedIn: 'root'
})
export class CacheService {
    currentUser: User;
    userProfile: UserProfile;
    lastRequest: BloodRequest;

    private _userChanged: Subject<User> = new Subject();
    public userChanged: Observable<User> = this._userChanged.asObservable();

    private _userProfileChanged: Subject<UserProfile> = new Subject();
    public userProfileChanged: Observable<UserProfile> = this._userProfileChanged.asObservable();

    private _requestProfileChanged: Subject<BloodRequest> = new Subject();
    public requestProfileChanged: Observable<BloodRequest> = this._requestProfileChanged.asObservable();

    constructor(
    ) { }

    public loadUser(user: User) {
        this.currentUser = user;
        this._userChanged.next(user);
    }

    public loadUserProfile(userProfile: UserProfile) {
        this.userProfile = userProfile;
        this._userProfileChanged.next(userProfile);
    }

    public loadRequest(request: BloodRequest) {
        this.lastRequest = request;
        this._requestProfileChanged.next(request);
    }

    public clearCurrentUser(): void {
        this.currentUser = null;
        this.userProfile = null;
    }

}