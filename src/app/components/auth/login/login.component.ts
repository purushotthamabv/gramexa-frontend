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
  isLoading = false;
  errorMessage = '';

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
  }

  onSubmit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userLogin();
    console.log(this.loginForm.value);
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

          console.log(response);

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

          console.log(error);

          this.errorMessage =
            error?.error?.message ||
            'Login failed';
        }
      });
      }
}
