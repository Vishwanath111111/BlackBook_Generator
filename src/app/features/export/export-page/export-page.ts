import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../core/services/project';
import { ExportService } from '../../../core/services/export';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-export-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-page.html',
  styleUrl: './export-page.scss'
})
export class ExportPage {
  readonly projectService = inject(ProjectService);
  readonly exportService = inject(ExportService);

  get activeProject(): Project | null {
    return this.projectService.activeProject();
  }

  selectProject(projId: string): void {
    this.projectService.setActiveProject(projId);
  }

  onExportDocx(): void {
    if (this.activeProject) {
      this.exportService.exportToDocx(this.activeProject);
    }
  }

  onPrintPdf(): void {
    if (this.activeProject) {
      this.exportService.printPdfView(this.activeProject);
    }
  }

  onExportMarkdown(): void {
    if (this.activeProject) {
      this.exportService.exportToMarkdown(this.activeProject);
    }
  }

  onExportText(): void {
    if (this.activeProject) {
      this.exportService.exportToText(this.activeProject);
    }
  }

  get completedChaptersCount(): number {
    return this.activeProject?.chapters.filter(c => c.status === 'completed').length || 0;
  }

  get totalWords(): number {
    return this.activeProject?.chapters.reduce((sum, c) => sum + (c.wordCountActual || 0), 0) || 0;
  }
}
