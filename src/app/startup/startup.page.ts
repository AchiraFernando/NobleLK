import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-startup',
    templateUrl: './startup.page.html',
    styleUrls: ['./startup.page.scss'],
})
export class StartupPage implements OnInit {

    slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    constructor() { }

    ngOnInit() {
    }

}
