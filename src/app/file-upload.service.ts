import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

    constructor(private fireStorage: AngularFireStorage) {
    }

    async uploadToFireStorage(file, id: string, storeFolder: string): Promise<any> {
        if (file) {
            // `${id}-${Math.floor(Math.random() * 100)}`
            const task = await this.fireStorage.ref(storeFolder).child(id).put(file);
            return this.fireStorage.ref(`${storeFolder}/${id}`).getDownloadURL().toPromise();
        }
    }

}
