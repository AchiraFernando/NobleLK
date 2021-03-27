import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class ToastService {
    userData: any;

    constructor(
        private toastController: ToastController,
    ) {}

    public async generateToast(message: string, duration: number) {
        let toast = this.toastController.create({
            message: message,
            duration: duration,
            position: 'bottom'
        });
        (await toast).present();
    }
}