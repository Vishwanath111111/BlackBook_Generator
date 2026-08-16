import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project';
import { Project, ENGINEERING_BRANCHES } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectList {
  readonly projectService = inject(ProjectService);
  
  branches = ['All Branches', ...ENGINEERING_BRANCHES];
  selectedBranch: string = 'All Branches';
  searchQuery: string = '';

  get filteredProjects(): Project[] {
    return this.projectService.projects().filter(p => {
      const matchesBranch = this.selectedBranch === 'All Branches' || p.branch === this.selectedBranch;
      const matchesSearch = !this.searchQuery || 
        p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.studentName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesBranch && matchesSearch;
    });
  }

  filterByBranch(branch: string): void {
    this.selectedBranch = branch;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  selectAndNavigate(proj: Project): void {
    this.projectService.setActiveProject(proj.id);
  }

  deleteProject(event: Event, id: string): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this Black Book project?')) {
      this.projectService.deleteProject(id);
    }
  }
}
