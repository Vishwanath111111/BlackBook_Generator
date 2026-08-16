import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ENGINEERING_BRANCHES } from '../../../models/project.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  branches = ENGINEERING_BRANCHES;

  signupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    collegeName: ['Mumbai Institute of Technology', [Validators.required]],
    branch: ['Computer Engineering', [Validators.required]]
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please complete all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password, collegeName, branch } = this.signupForm.value;
    const res = this.authService.signup(name, email, password, collegeName, branch);

    setTimeout(() => {
      this.isLoading = false;
      if (res.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = res.message;
      }
    }, 600);
  }
}
