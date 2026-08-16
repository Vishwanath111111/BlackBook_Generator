import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ProjectService } from '../../../core/services/project';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);
  private router = inject(Router);

  isProfileMenuOpen = false;

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onSelectProject(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.value) {
      this.projectService.setActiveProject(target.value);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
