import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { CacheService } from '../cache.service';
import { UserProfile } from '../models/user-profile.model';
import { User } from '../models/user.model';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.page.html',
    styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

    public pages = [];

    selectedPath = '';

    constructor(
        public router: Router,
        private cacheService: CacheService,
        private authenticationService: AuthenticationService,
    ) {
    }

    public get currentUserProfile(): UserProfile {
        return this.cacheService.userProfile;
    }

    public get isUserLoggedIn(): boolean {
        let currUser = JSON.parse(localStorage.getItem('user')) as User;
        return !!currUser;
    }

    ngOnInit() {
        this.router.events.subscribe((event: RouterEvent) => {
            this.pages = this.generateMenuItemList();
        });
        this.pages = this.generateMenuItemList();
    }

    public buttonClick(menuId: string, url: string): void {
        switch (menuId) {
            case 'startup':
                this.router.navigateByUrl(url);
                break;
            case 'login':
                this.router.navigateByUrl(url);
                break;
            case 'register':
                this.router.navigateByUrl(url);
                break;
            case 'profile':
                this.router.navigateByUrl(url);
                break;
            case 'request-blood':
                this.router.navigateByUrl(url);
                break;
            case 'dashboard':
                this.router.navigateByUrl(url);
                break;
            case 'find-blood-banks':
                this.router.navigateByUrl(url);
                break;
            case 'requested-donors':
                this.router.navigateByUrl(url);
                break;
            case 'donor-details':
                this.router.navigateByUrl(url);
                break;
            case 'logout':
                this.authenticationService.signOut();
                this.cacheService.clearCurrentUser();
                break;
        }
    }

    get titleStyles() {
        if (this.isUserLoggedIn && this.currentUserProfile) {
            return { 'margin-top': '16px' };
        }
    }

    private generateMenuItemList() {
        if (this.router.url.includes('/login')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'login',
                    title: 'Login',
                    url: '/login'
                },
                {
                    menuId: 'register',
                    title: 'Register',
                    url: '/register'
                },
            ];
        }
        if (this.router.url.includes('/profile')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'profile',
                    title: 'Profile',
                    url: '/profile'
                },
                {
                    menuId: 'logout',
                    title: 'Logout',
                    url: '/logout'
                },
            ];
        }
        if (this.router.url.includes('/register')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'login',
                    title: 'Login',
                    url: '/login'
                },
                {
                    menuId: 'register',
                    title: 'Register',
                    url: '/register'
                },
            ];
        }
        if (this.router.url.includes('/requested-donors')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'requested-donors',
                    title: 'Requested Donors',
                    url: '/requested-donors'
                },
                {
                    menuId: 'request-blood',
                    title: 'New Blood Request',
                    url: '/request-blood'
                }
            ];
        }
        if (this.router.url.includes('/donor-details')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'donor-details',
                    title: 'Donor Details',
                    url: '/donor-details'
                },
                {
                    menuId: 'requested-donors',
                    title: 'Requested Donors',
                    url: '/requested-donors'
                },
                {
                    menuId: 'request-blood',
                    title: 'New Blood Request',
                    url: '/request-blood'
                }
            ];
        }
        if (this.router.url.includes('/request-blood')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'request-blood',
                    title: 'New Blood Request',
                    url: '/request-blood'
                }
            ];
        }
        if (this.router.url.includes('/forgot-password')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'login',
                    title: 'Login',
                    url: '/login'
                },
            ];
        }
        if (this.router.url.includes('/donors')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'donors',
                    title: 'Donors',
                    url: '/donors'
                },
            ];
        }
        if (this.router.url.includes('/find-blood-banks')) {
            return [
                {
                    menuId: 'dashboard',
                    title: 'Dashboard',
                    url: '/dashboard'
                },
                {
                    menuId: 'find-blood-banks',
                    title: 'Find Blood Banks',
                    url: '/find-blood-banks'
                },
            ];
        }
    }

}
