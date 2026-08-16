import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['rahul.sharma@engg.edu', [Validators.required, Validators.email]],
    password: ['student123', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please provide a valid email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const res = this.authService.login(email, password);

    setTimeout(() => {
      this.isLoading = false;
      if (res.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = res.message;
      }
    }, 600);
  }

  quickDemoLogin(): void {
    this.loginForm.patchValue({
      email: 'rahul.sharma@engg.edu',
      password: 'student123'
    });
    this.onSubmit();
  }
}
