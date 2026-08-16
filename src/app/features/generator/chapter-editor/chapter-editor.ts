import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project';
import { Project } from '../../../models/project.model';
import { Chapter } from '../../../models/chapter.model';

@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chapter-editor.html',
  styleUrl: './chapter-editor.scss'
})
export class ChapterEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly projectService = inject(ProjectService);

  projectId: string = '';
  chapterId: string = '';
  project?: Project;
  chapter?: Chapter;
  editorContent: string = '';
  activeTab: 'editor' | 'preview' | 'split' = 'split';
  isSaved: boolean = true;
  saveMessage: string = 'All changes saved';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.chapterId = params['chapterId'];

      if (this.projectId) {
        this.projectService.setActiveProject(this.projectId);
        this.project = this.projectService.getProjectById(this.projectId);
        this.chapter = this.project?.chapters.find(c => c.id === this.chapterId);
        if (this.chapter) {
          this.editorContent = this.chapter.content || '';
        }
      }
    });
  }

  get wordCount(): number {
    if (!this.editorContent || !this.editorContent.trim()) return 0;
    return this.editorContent.trim().split(/\s+/).length;
  }

  get readingTimeMinutes(): number {
    return Math.max(1, Math.ceil(this.wordCount / 200));
  }

  onContentChange(): void {
    this.isSaved = false;
    this.saveMessage = 'Unsaved changes...';
  }

  saveChanges(): void {
    if (this.project && this.chapter) {
      this.projectService.updateChapter(this.project.id, this.chapter.id, this.editorContent, 'completed');
      this.isSaved = true;
      this.saveMessage = 'All changes saved!';
      setTimeout(() => {
        if (this.isSaved) this.saveMessage = 'Saved to storage';
      }, 2000);
    }
  }

  aiExpandContent(): void {
    this.editorContent += `\n\n## Additional In-Depth Analysis\nFurther empirical validation of the proposed system confirms improved efficiency, lower CPU utilization, and enhanced scalability under high concurrent query loads.`;
    this.onContentChange();
    this.saveChanges();
  }

  aiAddTable(): void {
    this.editorContent += `\n\n### Experimental Test Results Table\n| Module | Test Iterations | Latency (ms) | Pass Rate |\n| :--- | :--- | :--- | :--- |\n| Authentication | 500 | 45ms | 100% |\n| AI Inference | 250 | 320ms | 98.4% |\n| DOCX Export | 100 | 180ms | 100% |\n`;
    this.onContentChange();
    this.saveChanges();
  }

  formatMarkdown(md: string): string {
    if (!md) return '<p><em>No content available. Click Editor tab to write content.</em></p>';
    return md
      .replace(/^### (.*$)/gim, '<h3 class="preview-h3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="preview-h2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="preview-h1">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```mermaid([\s\S]*?)```/g, '<div class="mermaid-box"><strong>[Dynamic Diagram Code]</strong><pre><code>$1</code></pre></div>')
      .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }
}
