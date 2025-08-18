import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ServiceService } from './Provider/service.service';
import { Location } from '@angular/common';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  pages = [];

  backClick = 0;
  appversioncode: any;
  VersionNumber: any;
  PlatformName: any;
  FUserId: any;
  LoginId: any;

  constructor(
    public platform: Platform,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public service: ServiceService,
    public storage: Storage,
    public loadingController: LoadingController,
    private _location: Location,
    public appVersion: AppVersion,
    public iab: InAppBrowser
  ) {
    this.platform.resume.subscribe(async () => {
      console.log('Platform resume');
    
     
    });
    this.platform.ready().then(() => {
      this.pages = [
        // {title: 'Change Password', url: '/change-password', icon: 'key'},
        // { title: 'Log Out', url: '/login', icon: 'power' },
      ];

      SplashScreen.hide().then(() => console.log('Splash screen hidden'));

      this.service.baseUrl = 'http://192.168.0.200/sp_notes_codeigniter/'; // local WWGS
      

      this.setAndroidBackButtonBehavior();
    
   

      Promise.all([
        this.storage.get('LoginId'),
        this.storage.get('UserName'),
      ]).then(async (val) => {
        // alert(val);
        if (val[0] != '' && val[0] != 'null' && val[0] != null) {
          menuCtrl.enable(true);
          this.service.UserName = val[1];
          this.navCtrl.navigateRoot('/tabs/tabs/tab1');
        } else {
          // this.navCtrl.navigateRoot('/login');
        }
      });

      this.appVersion.getVersionNumber().then((getVersionNumber) => {
        console.log('getVersionNumber ' + getVersionNumber);
        this.appversioncode = getVersionNumber;
      });
    });
  }

 

  openPage(page) {
    console.log('page.url->', page.url);
    // close the menu when clicking a link from the menu
    this.menuCtrl.close();
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(page.component);
    if (page.url) {
      if (page.url == '/login') {
        this.alertCtrl
          .create({
            header: 'Logout!',
            message: 'Do you want to logout?',
            backdropDismiss: false,
            buttons: [
              {
                text: 'Close',
                handler: () => {
                  console.log('close');
                },
              },
              {
                text: 'Ok',
                handler: () => {
                  this.logout();
                },
              },
            ],
          })
          .then((alert) => {
            alert.present();
          });
      } else {
        this.navCtrl.navigateForward(page.url);
      }
    } else {
      this.alertCtrl
        .create({
          header: 'Logout!',
          message: 'Do you want to logout?',
          backdropDismiss: false,
          buttons: [
            {
              text: 'Close',
              handler: () => {
                console.log('close');
              },
            },
            {
              text: 'Ok',
              handler: () => {
                this.logout();
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

 
  logout() {
    localStorage.clear(); // or remove only token/userId if needed
    this.menuCtrl.close(); // optional: close the menu
    this.navCtrl.navigateRoot('/login'); // redirect to login page
  }

  public setAndroidBackButtonBehavior() {
    console.log('this.backClick->', this.backClick);

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      if (
        this._location.isCurrentPathEqualTo('/tabs/tabs/tab1') ||
        this._location.isCurrentPathEqualTo('/tabs/tabs/tab2') ||
        this._location.isCurrentPathEqualTo('/tabs/tabs/tab3') ||
        this._location.isCurrentPathEqualTo('/tabs/tabs/tab4') ||
        this._location.isCurrentPathEqualTo('/tabs/tabs/tab5') ||
        this._location.isCurrentPathEqualTo('/tw-tabs/tab1') ||
        this._location.isCurrentPathEqualTo('/tw-tabs/tab2') ||
        this._location.isCurrentPathEqualTo('/tw-tabs/tab3') ||
        this._location.isCurrentPathEqualTo('/tw-tabs/tab4') ||
        this._location.isCurrentPathEqualTo('/tw-tabs/tab5') ||
        this._location.isCurrentPathEqualTo('gotoMainDashboard') ||
        this._location.isCurrentPathEqualTo('/login')
      ) {
        this.backClick = this.backClick + 1;
        if (this.backClick == 1) {
          this.showExitConfirm();
        }
      } else {
        this.navCtrl.pop();
      }
    });
  }




  showExitConfirm() {
    this.alertCtrl
      .create({
        message: 'Do you want to close the app ?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Stay',
            role: 'cancel',
            handler: () => {
              this.backClick = 0;
              console.log('Application exit prevented!');
            },
          },
          {
            text: 'Exit',
            handler: () => {
              navigator['app'].exitApp();
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async presentAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: title,
      // subHeader: 'Subtitle',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait..',
      cssClass: 'my-custom-class',
      translucent: true,
      showBackdrop: false,
    });
    return await loading.present();
  }
}
