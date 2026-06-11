import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadProfile();
  }

  createForm() {
    this.profileForm = this.fb.group({
      name: [
        '',
        Validators.required
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9]\\d{9}$')
        ]
      ],
      role: [
        {
          value: '',
          disabled: true
        }
      ]
    });
  }

  loadProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ||
          'Unable to load profile';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: profile.name,
            mobile: profile.mobileNumber,
            role: profile.role
          })
        );
        this.successMessage = 'Profile updated successfully';
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ||
          'Unable to update profile';
        this.isSaving = false;
      }
    });
  }
}
