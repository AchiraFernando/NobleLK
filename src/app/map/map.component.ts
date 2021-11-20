import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { BloodBank } from '../models/blood-bank.model';
import { UserProfile } from '../models/user-profile.model';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnInit, OnChanges {

    @ViewChild('map') mapElement: any;
    private map: google.maps.Map;
    private marker1: google.maps.Marker;
    private marker2: google.maps.Marker;

    @Input()
    public readonly = false;

    @Input()
    public currentLocation: google.maps.LatLng;

    @Input()
    public secondLocation: google.maps.LatLng;

    @Input()
    public donorList: UserProfile[] = [];

    @Input()
    public bloodBankList: BloodBank[] = [];

    @Input()
    public zoomLevel = 12;

    @Input()
    public isFullScreen = false;

    @Output()
    public locationChange: EventEmitter<google.maps.LatLng> = new EventEmitter<google.maps.LatLng>();

    constructor(private geolocation: Geolocation) {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        // The marker
        if (this.marker1) {
            this.marker1.setPosition(this.currentLocation);
        } else {
            this.marker1 = this.createMarker(this.currentLocation);
        }

        if (this.secondLocation) {
            if (this.marker2) {
                this.marker2.setPosition(this.secondLocation);
            } else {
                this.marker2 = this.createMarker(this.secondLocation, 'ddf542');
            }
        }

        if (this.donorList && this.donorList.length) {
            const infowindow = new google.maps.InfoWindow();
            this.donorList.forEach((donor, index) => {
                const coordinates: google.maps.LatLng = new google.maps.LatLng(0);
                coordinates.lat = () => donor.latitude;
                coordinates.lng = () => donor.longitude;
                const infoContent = `
                    <p style="font-size: 14px;">
                        <strong>Name:</strong> ${donor.firstname} ${donor.surname} <br />
                        <strong>Blood Group:</strong> ${donor.bloodGroup} <br />
                        <strong>Mobile Number:</strong> +94${donor.mobileNumber}
                    </p>
                `;
                this.createMarker(coordinates, 'ddf542', infowindow, infoContent);
            });
        }

        if (this.bloodBankList && this.bloodBankList.length) {
            const infowindow = new google.maps.InfoWindow();
            this.bloodBankList.forEach((bloodBank, index) => {
                const coordinates: google.maps.LatLng = new google.maps.LatLng(0);
                coordinates.lat = () => bloodBank.latitude;
                coordinates.lng = () => bloodBank.longitude;
                const infoContent = `
                    <p style="font-size: 14px;">
                        <strong>Name:</strong> ${bloodBank.name} <br />
                        <strong>Contact Number:</strong> +${bloodBank.phoneNumber} <br />
                    </p>
                `;
                this.createMarker(coordinates, 'ff0000', infowindow, infoContent);
            });
        }
    }

    ngAfterViewInit() {
        const mapOptions: google.maps.MapOptions = {
            center: this.currentLocation,
            zoom: this.zoomLevel,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        if (!this.currentLocation) {
            this.geolocation.getCurrentPosition().then((res: Geoposition) => {
                this.currentLocation = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
                this.locationChange.emit(this.currentLocation);
                this.marker1 = this.createMarker(this.currentLocation);
                this.map.setCenter(this.currentLocation);
            }).catch((err) => {
                console.log('Error getting location', err);
            });
        } else {
            // The marker
            this.marker1 = this.createMarker(this.currentLocation);
        }

        if (this.secondLocation) {
            this.marker2 = this.createMarker(this.secondLocation, 'ddf542');
        }
    }

    createMarker(
        coordinates: google.maps.LatLng,
        markerColor?: string,
        infoWindow?: google.maps.InfoWindow,
        contentString?: string
    ): google.maps.Marker {
        // The marker
        const marker = new google.maps.Marker({
            position: coordinates,
            map: this.map,
            draggable: this.readonly ? false : true,
            icon: markerColor ? `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${markerColor}` : null,
        });
        marker.setMap(this.map);

        google.maps.event.addListener(marker, 'drag', (event) => {
            this.currentLocation = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

            this.locationChange.emit(this.currentLocation);
            // let infowindow = new google.maps.InfoWindow({
            //     content: 'Latitude: ' + event.latLng.lat() + '<br>Longitude: ' + event.latLng.lng()
            // });
            // infowindow.open(this.map, marker);
        });

        google.maps.event.addListener(marker, 'click', (event) => {
            infoWindow.setContent(contentString);
            infoWindow.open(this.map, marker);
        });

        return marker;
    }

    // CAN'T USE GEOCODE AS IT REQUIRES PAYMENTS
    // geocodeLatLng(
    //     geocoder: google.maps.Geocoder,
    //     latlon: google.maps.LatLng,
    // ) {
    // const infowindow = new google.maps.InfoWindow();
    // geocoder
    //     .geocode({ location: latlon })
    //     .then((response) => {
    //         if (response.results[0]) {
    //             this.map.setZoom(11);
    //             const marker = new google.maps.Marker({
    //                 position: latlon,
    //                 map: this.map,
    //             });
    //             infowindow.setContent(response.results[0].formatted_address);
    //             infowindow.open(this.map, marker);
    //         } else {
    //             window.alert('No results found');
    //         }
    //     })
    //     .catch((e) => window.alert('Geocoder failed due to: ' + e));
    // }

    // generateGeocode() {
    //     const geocoder = new google.maps.Geocoder();
    //     this.geocodeLatLng(geocoder, this.currentLocation);
    // }

}
