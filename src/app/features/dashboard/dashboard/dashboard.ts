import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ProjectService } from '../../../core/services/project';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  readonly authService = inject(AuthService);
  readonly projectService = inject(ProjectService);

  get totalWordsGenerated(): number {
    return this.projectService.projects().reduce((acc, proj) => {
      const projWords = proj.chapters.reduce((sum, ch) => sum + (ch.wordCountActual || 0), 0);
      return acc + projWords;
    }, 0);
  }

  get completedChaptersCount(): number {
    return this.projectService.projects().reduce((acc, proj) => {
      const done = proj.chapters.filter(c => c.status === 'completed').length;
      return acc + done;
    }, 0);
  }

  get totalChaptersCount(): number {
    return this.projectService.projects().reduce((acc, proj) => acc + proj.chapters.length, 0);
  }

  selectProject(proj: Project): void {
    this.projectService.setActiveProject(proj.id);
  }
}
