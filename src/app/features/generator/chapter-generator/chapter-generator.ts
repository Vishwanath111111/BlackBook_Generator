import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project';
import { GeminiService } from '../../../core/services/gemini';
import { AuthService } from '../../../core/services/auth';
import { Chapter, WordCountTarget, WORD_COUNT_PRESETS } from '../../../models/chapter.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-chapter-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner],
  templateUrl: './chapter-generator.html',
  styleUrl: './chapter-generator.scss'
})
export class ChapterGenerator implements OnInit {
  readonly projectService = inject(ProjectService);
  private geminiService = inject(GeminiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  presets = WORD_COUNT_PRESETS;
  selectedChapterId: string = '';
  selectedWordCount: WordCountTarget = 'medium';
  customInstructions: string = '';
  isGenerating: boolean = false;
  generationProgressMessage: string = '';

  ngOnInit(): void {
    const active = this.projectService.activeProject();
    if (active && active.chapters.length > 0) {
      this.selectedChapterId = active.chapters[0].id;
    }
  }

  get selectedChapter(): Chapter | undefined {
    const active = this.projectService.activeProject();
    return active?.chapters.find(c => c.id === this.selectedChapterId);
  }

  selectWordCount(preset: WordCountTarget): void {
    this.selectedWordCount = preset;
  }

  async onGenerate(): Promise<void> {
    const project = this.projectService.activeProject();
    const chapter = this.selectedChapter;

    if (!project || !chapter) {
      alert('Please select a valid Black Book project and chapter.');
      return;
    }

    this.isGenerating = true;
    this.generationProgressMessage = `Generating Chapter ${chapter.chapterNumber}: ${chapter.title}...`;

    try {
      const generatedContent = await this.geminiService.generateChapterContent(
        project,
        chapter,
        this.selectedWordCount,
        this.customInstructions
      );

      // Deduct credits based on preset
      const creditCostMap: Record<WordCountTarget, number> = { short: 400, medium: 700, long: 1000 };
      this.authService.deductCredits(creditCostMap[this.selectedWordCount]);

      // Update project chapter
      this.projectService.updateChapter(project.id, chapter.id, generatedContent, 'completed');

      this.isGenerating = false;
      // Navigate to Editor
      this.router.navigate(['/generator/editor', project.id, chapter.id]);
    } catch {
      this.isGenerating = false;
      alert('Failed to generate chapter content. Please try again.');
    }
  }
}
