import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonText
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegistering = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  async onSubmit() {
    if (this.isRegistering) {
      if (this.registerForm.valid) {
        await this.register();
      }
    } else {
      if (this.loginForm.valid) {
        await this.login();
      }
    }
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...'
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      await firstValueFrom(this.authService.login(email, password));
      await loading.dismiss();
      await this.router.navigate(['/tabs']);
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Yeah... we def aint logging in.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async register() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating account...'
    });
    await loading.present();

    try {
      const formValue = this.registerForm.value;
      await firstValueFrom(this.authService.register({
        email: formValue.email,
        password: formValue.password,
        first_name: formValue.firstName,
        last_name: formValue.lastName
      }));

      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Registration successful! Please log in.',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
      this.toggleForm();
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Registration failed. Please try again.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    if (this.isRegistering) {
      this.registerForm.reset();
    } else {
      this.loginForm.reset();
    }
  }
}
