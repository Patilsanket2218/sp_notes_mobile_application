import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../Provider/service.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private navCtrl: NavController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

 onLogin() {
  const formData = this.loginForm.value;

  this.service.httppostcall('auth/login', formData).subscribe(
    (res: any) => {
      if (res.status === 'success') {
        localStorage.setItem('token', res.token); // Store token
        localStorage.setItem('userEmail', formData.email); // Optional
        localStorage.setItem('userId', res.user.id); // ✅ Store user ID here

        this.service.toastMethod('Login successful!');
        this.navCtrl.navigateRoot('/tabs'); // Redirect after login
      } else {
        this.service.alertMethod('Login Failed', res.message || 'Invalid credentials.');
      }
    },
    (err) => {
      this.service.alertMethod('Error', 'Something went wrong!');
      console.error(err);
    }
  );
}


  goToSignup() {
    this.navCtrl.navigateRoot('/signup');
  }
}
