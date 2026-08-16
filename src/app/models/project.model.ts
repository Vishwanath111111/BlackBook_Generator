import { Chapter } from './chapter.model';

export interface Project {
  id: string;
  title: string;
  branch: string;
  techStack: string;
  description: string;
  collegeName: string;
  studentName: string;
  guideName: string;
  academicYear: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  branch: string;
  techStack: string;
  description: string;
  collegeName: string;
  studentName: string;
  guideName: string;
  academicYear: string;
}

export const ENGINEERING_BRANCHES: string[] = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Computer Science & Engineering (IoT)',
  'Electronics & Telecommunication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering'
];
