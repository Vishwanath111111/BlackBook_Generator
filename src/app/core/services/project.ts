import { Injectable, signal, computed } from '@angular/core';
import { Project, CreateProjectDto } from '../../models/project.model';
import { Chapter } from '../../models/chapter.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>(this.loadProjectsFromStorage());
  private activeProjectIdSignal = signal<string | null>(null);

  readonly projects = computed(() => this.projectsSignal());
  readonly activeProject = computed(() => {
    const id = this.activeProjectIdSignal();
    const list = this.projectsSignal();
    return list.find(p => p.id === id) || list[0] || null;
  });

  constructor() {
    if (this.projectsSignal().length === 0) {
      const demoProject = this.createDefaultDemoProject();
      this.setProjects([demoProject]);
      this.activeProjectIdSignal.set(demoProject.id);
    } else {
      this.activeProjectIdSignal.set(this.projectsSignal()[0].id);
    }
  }

  private loadProjectsFromStorage(): Project[] {
    try {
      const data = localStorage.getItem('blackbook_projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setProjects(projects: Project[]): void {
    this.projectsSignal.set(projects);
    localStorage.setItem('blackbook_projects', JSON.stringify(projects));
  }

  setActiveProject(id: string): void {
    this.activeProjectIdSignal.set(id);
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }

  createProject(dto: CreateProjectDto): Project {
    const defaultChapters: Chapter[] = [
      {
        id: 'ch_1_' + Date.now(),
        chapterNumber: 1,
        title: 'Introduction',
        synopsis: 'Background of the project, problem statement, objectives, and scope.',
        wordCountTarget: 'medium',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_2_' + Date.now(),
        chapterNumber: 2,
        title: 'Literature Survey',
        synopsis: 'Review of existing systems, comparative analysis table, and proposed system advantages.',
        wordCountTarget: 'medium',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_3_' + Date.now(),
        chapterNumber: 3,
        title: 'Requirement Analysis',
        synopsis: 'Hardware & software specifications, feasibility study, functional & non-functional requirements.',
        wordCountTarget: 'medium',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_4_' + Date.now(),
        chapterNumber: 4,
        title: 'System Design',
        synopsis: 'System architecture diagram, Use Case, Class, ER, and DFD Level 0/1 diagrams with Mermaid code.',
        wordCountTarget: 'long',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_5_' + Date.now(),
        chapterNumber: 5,
        title: 'Implementation',
        synopsis: 'Detailed module description, algorithms used, code workflow, and key code snippets.',
        wordCountTarget: 'long',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_6_' + Date.now(),
        chapterNumber: 6,
        title: 'Testing',
        synopsis: 'Testing methodology, unit & integration test cases table, system test results.',
        wordCountTarget: 'medium',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_7_' + Date.now(),
        chapterNumber: 7,
        title: 'Conclusion & Future Scope',
        synopsis: 'Summary of project achievements, key advantages, limitations, and potential future enhancements.',
        wordCountTarget: 'short',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ch_8_' + Date.now(),
        chapterNumber: 8,
        title: 'References',
        synopsis: 'Standard IEEE citations for research papers, books, documentation, and web sources.',
        wordCountTarget: 'short',
        content: '',
        status: 'draft',
        wordCountActual: 0,
        lastUpdated: new Date().toISOString()
      }
    ];

    const newProj: Project = {
      id: 'proj_' + Date.now(),
      ...dto,
      chapters: defaultChapters,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newProj, ...this.projectsSignal()];
    this.setProjects(updatedList);
    this.activeProjectIdSignal.set(newProj.id);
    return newProj;
  }

  updateChapter(projectId: string, chapterId: string, updatedContent: string, status: 'draft' | 'generating' | 'completed' = 'completed'): void {
    const projects = this.projectsSignal();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const project = projects[projectIndex];
    const chapterIndex = project.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return;

    const chapter = project.chapters[chapterIndex];
    const wordCount = updatedContent.trim() ? updatedContent.trim().split(/\s+/).length : 0;

    const updatedChapter: Chapter = {
      ...chapter,
      content: updatedContent,
      status: status,
      wordCountActual: wordCount,
      lastUpdated: new Date().toISOString()
    };

    const updatedChapters = [...project.chapters];
    updatedChapters[chapterIndex] = updatedChapter;

    const updatedProject: Project = {
      ...project,
      chapters: updatedChapters,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = updatedProject;
    this.setProjects(updatedProjects);
  }

  deleteProject(id: string): void {
    const filtered = this.projectsSignal().filter(p => p.id !== id);
    this.setProjects(filtered);
    if (this.activeProjectIdSignal() === id) {
      this.activeProjectIdSignal.set(filtered[0]?.id || null);
    }
  }

  private createDefaultDemoProject(): Project {
    return {
      id: 'proj_demo_001',
      title: 'AI-Powered Smart Healthcare Diagnostics & Patient Monitoring Portal',
      branch: 'Computer Engineering',
      techStack: 'Angular 22, Node.js, Express, Python, TensorFlow, OpenCV, MongoDB',
      description: 'An intelligent medical assistance system designed to analyze patient symptoms, diagnostic imaging reports, and vital signs using deep learning algorithms to assist doctors with early disease detection and automated prescription workflows.',
      collegeName: 'Mumbai Institute of Technology',
      studentName: 'Rahul Sharma & Team',
      guideName: 'Dr. A. K. Verma',
      academicYear: '2025-2026',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-04',
      chapters: [
        {
          id: 'ch_demo_1',
          chapterNumber: 1,
          title: 'Introduction',
          synopsis: 'Background, problem statement, project goals, and scope of AI healthcare diagnostics.',
          wordCountTarget: 'medium',
          status: 'completed',
          wordCountActual: 680,
          lastUpdated: '2026-08-04T10:00:00Z',
          content: `## 1.1 Background & Motivation
In recent years, the integration of Artificial Intelligence (AI) and Machine Learning (ML) into healthcare infrastructure has transformed medical diagnostics and patient care delivery. Early detection of pathological conditions plays a pivotal role in minimizing mortality rates and improving clinical outcomes. However, primary healthcare facilities in rural and under-resourced regions often suffer from a shortage of specialized radiologists and diagnostic experts. 

The **AI-Powered Smart Healthcare Diagnostics & Patient Monitoring Portal** bridges this technological divide by offering automated, high-accuracy diagnostic assistance powered by Convolutional Neural Networks (CNNs) and Large Language Models (LLMs).

## 1.2 Problem Statement
Traditional diagnostic pipelines rely heavily on manual interpretation of diagnostic scans (X-rays, CT scans) and symptom logs. This manual process presents key challenges:
1. **Diagnostic Delays**: Extended waiting periods for specialist report verification.
2. **Human Error Risk**: High workload levels lead to cognitive fatigue and diagnostic oversights.
3. **Accessibility Gap**: Rural clinics lack immediate access to expert pathologists and diagnostic radiographers.

## 1.3 Project Objectives
The primary objectives of this project are:
- To construct a web platform using **Angular 22** for seamless clinician-patient interaction.
- To deploy a deep learning backend trained on standardized medical imaging datasets (Chest X-Ray, Dermatological Scans).
- To implement automated risk score calculations and instant prescription recommendation summaries.
- To establish encrypted Data Protection pipelines compliant with HIPAA security standards.

## 1.4 Scope of the Project
The scope encompasses symptom input processing, deep learning scan inference, interactive prescription editing, and PDF/DOCX diagnostic report generation.`
        },
        {
          id: 'ch_demo_2',
          chapterNumber: 2,
          title: 'Literature Survey',
          synopsis: 'Analysis of existing medical AI research papers and comparative system evaluation.',
          wordCountTarget: 'medium',
          status: 'completed',
          wordCountActual: 650,
          lastUpdated: '2026-08-04T10:15:00Z',
          content: `## 2.1 Existing Systems Overview
A detailed survey of published medical diagnostic solutions reveals multiple paradigms ranging from rule-based expert systems to modern deep neural networks. 

1. **Rule-Based Clinical Decision Systems**: Early platforms utilized predefined decision trees. While interpretable, they lack adaptivity to complex multimodal patient symptoms.
2. **Cloud-Based Telemedicine Portals**: Modern platforms enable remote video consultations but lack automated computer-vision screening for instant triage.

## 2.2 Comparative Analysis Table
| System Parameter | Traditional Telemedicine | Cloud AI Diagnostic Tools | Proposed BlackBook AI System |
| :--- | :--- | :--- | :--- |
| **Diagnostic Speed** | 24 - 48 Hours | 5 - 10 Minutes | Instant (< 3 Seconds) |
| **Multimodal Support** | Text Only | Images Only | Text + Medical Scans + Vitals |
| **Offline Capability** | No | No | Hybrid Local Cache Support |
| **UML System Design** | Basic Flowcharts | Proprietary Models | Standard Open Academic Models |

## 2.3 Advantages of the Proposed System
The proposed architecture provides high diagnostic accuracy (94.8% test accuracy), sub-second inference latency, and automated Black Book report generation.`
        },
        {
          id: 'ch_demo_3',
          chapterNumber: 3,
          title: 'Requirement Analysis',
          synopsis: 'Hardware, software, functional and non-functional requirement specifications.',
          wordCountTarget: 'medium',
          status: 'completed',
          wordCountActual: 550,
          lastUpdated: '2026-08-04T10:30:00Z',
          content: `## 3.1 Software Requirements
- **Frontend Framework**: Angular 22 (TypeScript, SCSS, RxJS, Signals)
- **Backend API**: Node.js v20+, Express.js framework
- **Deep Learning Engine**: Python 3.11, TensorFlow 2.15, PyTorch, OpenCV
- **Database**: MongoDB Atlas / PostgreSQL

## 3.2 Hardware Requirements
- **Processor**: Intel Core i7 12th Gen or AMD Ryzen 7 (Min 8 Cores)
- **RAM**: 16 GB DDR5
- **GPU**: NVIDIA RTX 4060 with 8GB VRAM (CUDA Accelerated)
- **Storage**: 512 GB NVMe SSD`
        },
        {
          id: 'ch_demo_4',
          chapterNumber: 4,
          title: 'System Design',
          synopsis: 'System Architecture, Use Case, Class, ER, and DFD Level 0/1 diagram descriptions with Mermaid syntax.',
          wordCountTarget: 'long',
          status: 'completed',
          wordCountActual: 820,
          lastUpdated: '2026-08-04T10:45:00Z',
          content: `## 4.1 System Architecture
The system follows a 3-tier decoupled architecture:
1. **Presentation Layer (Angular 22)**: Responsive, dark-themed dashboard.
2. **Application & AI Layer (Express & Python FastAPI)**: Microservice handling authentication, model inference, and report compilation.
3. **Database Layer (MongoDB & Redis)**: Encrypted patient records storage.

## 4.2 Use Case Diagram
The Use Case Diagram depicts interactions between the Primary Actors (**Doctor**, **Patient**, and **System Admin**) and core system modules.

\`\`\`mermaid
gantt
    title Healthcare System Module Workflow
    dateFormat  YYYY-MM-DD
    section Patient Intake
    Symptom Input           :a1, 2026-08-01, 3d
    Vitals Recording        :after a1, 2d
    section AI Inference
    Scan Analysis           :2026-08-05, 4d
    Report Generation       :after a1, 5d
\`\`\`

## 4.3 Entity-Relationship (ER) Diagram
The database schema connects Patients, Doctors, Diagnostic Reports, and Prescriptions.`
        },
        {
          id: 'ch_demo_5',
          chapterNumber: 5,
          title: 'Implementation',
          synopsis: 'Detailed module description, algorithms, and key code snippets.',
          wordCountTarget: 'long',
          status: 'completed',
          wordCountActual: 750,
          lastUpdated: '2026-08-04T11:00:00Z',
          content: `## 5.1 Module Descriptions
1. **User Authentication & RBAC Module**: Manages secure JWT session tokens.
2. **CNN Medical Scan Analysis Module**: Loads pre-trained ResNet50 neural network weights for pneumonia and skin lesion classification.
3. **Black Book Report Builder Module**: Dynamically structures PDF and DOCX reports according to university guidelines.

## 5.2 Core Code Snippet (AI Diagnostic Service)
\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class DiagnosticService {
  async predictDiagnosis(imageFile: File, symptoms: string[]): Promise<DiagnosisResult> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('symptoms', JSON.stringify(symptoms));
    return this.http.post<DiagnosisResult>('/api/v1/predict', formData).toPromise();
  }
}
\`\`\``
        },
        {
          id: 'ch_demo_6',
          chapterNumber: 6,
          title: 'Testing',
          synopsis: 'Testing strategy, unit & integration test cases table, system test results.',
          wordCountTarget: 'medium',
          status: 'completed',
          wordCountActual: 520,
          lastUpdated: '2026-08-04T11:15:00Z',
          content: `## 6.1 Test Plan & Methodology
Testing was conducted across three phases: Unit Testing (Vitest/Jasmine), Integration Testing (API endpoint validation), and User Acceptance Testing (UAT with medical practitioners).

## 6.2 Test Case Matrix Table
| Test Case ID | Test Scenario | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **TC_01** | Student Login with valid credentials | JWT token issued, redirect to Dashboard | **PASS** |
| **TC_02** | X-Ray image upload (.png format) | ResNet50 output prediction score > 90% | **PASS** |
| **TC_03** | Generate Chapter with Medium preset | Content generated ≈ 700 words | **PASS** |
| **TC_04** | Export Project to DOCX | Formatted .docx file downloaded | **PASS** |`
        },
        {
          id: 'ch_demo_7',
          chapterNumber: 7,
          title: 'Conclusion & Future Scope',
          synopsis: 'Summary of achievements, limitations, and future improvements.',
          wordCountTarget: 'short',
          status: 'completed',
          wordCountActual: 410,
          lastUpdated: '2026-08-04T11:30:00Z',
          content: `## 7.1 Conclusion
The **AI-Powered Smart Healthcare Diagnostics & Patient Monitoring Portal** successfully demonstrates the efficacy of deep learning in preliminary diagnostic triage. The platform achieves high diagnostic accuracy while reducing report compilation time from hours to seconds.

## 7.2 Future Scope
- Integration with HL7/FHIR EHR standards.
- Mobile application development for iOS and Android.
- Federated Learning implementation for multi-hospital privacy compliance.`
        },
        {
          id: 'ch_demo_8',
          chapterNumber: 8,
          title: 'References',
          synopsis: 'Standard IEEE citations.',
          wordCountTarget: 'short',
          status: 'completed',
          wordCountActual: 320,
          lastUpdated: '2026-08-04T11:45:00Z',
          content: `## References (IEEE Format)
1. A. Esteva et al., "Dermatologist-level classification of skin lesions with deep neural networks," *Nature*, vol. 542, no. 7639, pp. 115-118, 2017.
2. X. Wang et al., "ChestX-ray8: Hospital-scale Chest X-ray Database and Benchmarks," *IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 2017.
3. Angular Documentation, "Angular v22 Developer Guide & Standalone Architecture," 2026.`
        }
      ]
    };
  }
}
