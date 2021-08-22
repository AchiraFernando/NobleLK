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
            case 'logout':
                this.authenticationService.signOut();
                this.cacheService.clearCurrentUser();
                break;
        }
    }

    private generateMenuItemList() {
        if (this.router.url.includes('/login')) {
            return [
                {
                    menuId: 'startup',
                    title: 'Start-Up',
                    url: '/'
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
                    menuId: 'startup',
                    title: 'Start-Up',
                    url: '/'
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
                    menuId: 'startup',
                    title: 'Start-Up',
                    url: '/'
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
                    menuId: 'startup',
                    title: 'Start-Up',
                    url: '/'
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
                    menuId: 'startup',
                    title: 'Start-Up',
                    url: '/'
                }
            ];
        }
    }

}
