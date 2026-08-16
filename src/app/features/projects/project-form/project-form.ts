import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project';
import { AuthService } from '../../../core/services/auth';
import { ENGINEERING_BRANCHES } from '../../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss'
})
export class ProjectForm {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  branches = ENGINEERING_BRANCHES;
  user = this.authService.currentUser();

  projectForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    branch: [this.user?.branch || 'Computer Engineering', [Validators.required]],
    techStack: ['Angular 22, Node.js, Express, MongoDB, Python, AI APIs', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    collegeName: [this.user?.collegeName || 'Mumbai Institute of Technology', [Validators.required]],
    studentName: [this.user?.name || 'Rahul Sharma & Team', [Validators.required]],
    guideName: ['Dr. A. K. Verma', [Validators.required]],
    academicYear: ['2025-2026', [Validators.required]]
  });

  isSubmitting = false;

  onSubmit(): void {
    if (this.projectForm.invalid) {
      alert('Please fill out all required fields to create your Black Book project.');
      return;
    }

    this.isSubmitting = true;
    const newProject = this.projectService.createProject(this.projectForm.value);

    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/generator']);
    }, 400);
  }
}
