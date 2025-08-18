import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseUrl: any;
  getNotes(userId: string) {
    throw new Error('Method not implemented.');
  }
  deleteNote(id: number) {
    throw new Error('Method not implemented.');
  }
  showToast(arg0: string) {
    throw new Error('Method not implemented.');
  }

  //baseUrl: string = 'https://yourdomain.com/'; // ✅ Replace with your API base URL
  key = '47f393cfa2eee339cb33c4361319e2f9';

  SchoolId: string;
  token: any;
  UserName: any;
  getPackageName: any;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    console.log('✅ ServiceService initialized');
  }

  public httppostcall(url, data) {
        console.log('this is url' + url);
        return this.http.post(this.baseUrl + url, data)
            .pipe(map(data1 => {
                return data1;
            }));
    }

    public httpcall(url, p0: unknown) {
        console.log('this is url' + url);
        return this.http.get(this.baseUrl + url)
            .pipe(map(data1 => {
                return data1;
            }));
    }

  /**
   * Show toast message (bottom)
   */
  async toastMethod(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  /**
   * Basic alert with custom title and message
   */
  async alertMethod(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      mode: 'ios',
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Alert closed');
        }
      }]
    });
    await alert.present();
  }

  /**
   * Auto-dismiss alert after 500ms
   */
  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header,
      message,
      mode: 'ios',
      buttons: ['OK']
    });
    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 500);
  }
}
