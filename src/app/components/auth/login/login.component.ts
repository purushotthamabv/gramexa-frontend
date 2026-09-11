import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  isResetLoading = false;
  errorMessage = '';
  resetErrorMessage = '';
  resetSuccessMessage = '';
  isForgotPasswordMode = false;
  showPassword = false;
  showResetPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: [
        '',
        Validators.required
      ],
      password: [
        '',
        Validators.required
      ]
    });

    this.forgotPasswordForm = this.fb.group({
      username: [
        '',
        Validators.required
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userLogin();
  }

  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.errorMessage = '';
    this.resetErrorMessage = '';

    if (this.isForgotPasswordMode) {
      this.resetSuccessMessage = '';
      this.forgotPasswordForm.patchValue({
        username: this.loginForm.value.username || ''
      });
    } else {
      this.forgotPasswordForm.reset();
    }
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    if (this.forgotPasswordForm.value.newPassword !== this.forgotPasswordForm.value.confirmPassword) {
      this.resetErrorMessage = 'New password and confirm password do not match';
      return;
    }

    this.isResetLoading = true;
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';

    this.authService
      .forgotPassword({
        username: this.forgotPasswordForm.value.username,
        newPassword: this.forgotPasswordForm.value.newPassword
      })
      .subscribe({
        next: (response) => {
          this.isResetLoading = false;
          this.resetSuccessMessage = response;
          this.loginForm.patchValue({
            username: this.forgotPasswordForm.value.username,
            password: ''
          });
          this.forgotPasswordForm.reset();
          this.isForgotPasswordMode = false;
        },
        error: (error) => {
          this.isResetLoading = false;
          this.resetErrorMessage =
            error?.error?.message ||
            'Unable to reset password';
        }
      });
  }
  
      /**
       * LOGIN API CALL
       */

      userLogin() {
        if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (response: any) => {

          this.isLoading = false;

          // SAVE TOKEN IN COOKIE

          this.authService.saveToken(
            response.token
          );

          // OPTIONAL USER DATA

          localStorage.setItem(
            'user',
            JSON.stringify(response)
          );

          // SUCCESS NAVIGATION

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          this.router.navigateByUrl(
            returnUrl || '/home'
          );
        },

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Login failed';
        }
      });
      }
}
