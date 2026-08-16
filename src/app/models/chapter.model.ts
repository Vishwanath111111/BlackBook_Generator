export type WordCountTarget = 'short' | 'medium' | 'long';

export interface WordCountPreset {
  key: WordCountTarget;
  label: string;
  targetWords: number;
  description: string;
}

export const WORD_COUNT_PRESETS: WordCountPreset[] = [
  { key: 'short', label: 'Short', targetWords: 400, description: '≈ 400 words (Concise Summary & Core Points)' },
  { key: 'medium', label: 'Medium', targetWords: 700, description: '≈ 700 words (Balanced Academic Detail)' },
  { key: 'long', label: 'Long', targetWords: 1000, description: '≈ 1000 words (Comprehensive Deep Dive)' },
];

export interface MermaidDiagram {
  id: string;
  title: string;
  type: 'usecase' | 'class' | 'er' | 'dfd';
  code: string;
  description: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  synopsis: string;
  wordCountTarget: WordCountTarget;
  content: string;
  status: 'draft' | 'generating' | 'completed';
  wordCountActual: number;
  lastUpdated: string;
  mermaidDiagrams?: MermaidDiagram[];
}
