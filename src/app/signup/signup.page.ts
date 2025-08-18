import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../Provider/service.service'; // ✅ Ensure this path is correct
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private navCtrl: NavController
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSignup() {
  const formData = this.signupForm.value;

  this.service.httppostcall('auth/signup', formData).subscribe(
    (res: any) => {
      if (res.status === 'success') {
        this.service.toastMethod('Signup successful!');
        this.navCtrl.navigateRoot('/login'); // redirect to login page
      } else {
        this.service.alertMethod('Signup Failed', res.message || 'Please try again.');
      }
    },
    (err) => {
      this.service.alertMethod('Error', 'Something went wrong!');
      console.error(err);
    }
  );
}

goToLogin() {
  this.navCtrl.navigateRoot('/login');
}

}
