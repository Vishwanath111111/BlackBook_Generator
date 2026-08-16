import { Injectable } from '@angular/core';
import { Project } from '../../models/project.model';
import { Chapter } from '../../models/chapter.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToMarkdown(project: Project): void {
    let md = `# BLACK BOOK PROJECT REPORT\n\n`;
    md += `**Title**: ${project.title}\n`;
    md += `**Branch**: ${project.branch}\n`;
    md += `**College**: ${project.collegeName}\n`;
    md += `**Student Name**: ${project.studentName}\n`;
    md += `**Guide Name**: ${project.guideName}\n`;
    md += `**Academic Year**: ${project.academicYear}\n`;
    md += `**Tech Stack**: ${project.techStack}\n\n`;
    md += `---\n\n`;

    project.chapters.forEach(ch => {
      md += `# Chapter ${ch.chapterNumber}: ${ch.title}\n\n`;
      md += `${ch.content || '*[Content pending generation]*'}\n\n`;
      md += `---\n\n`;
    });

    this.downloadFile(md, `${this.sanitizeFilename(project.title)}_BlackBook.md`, 'text/markdown');
  }

  exportToText(project: Project): void {
    let txt = `========================================================================\n`;
    txt += `                    ACADEMIC BLACK BOOK REPORT                          \n`;
    txt += `========================================================================\n\n`;
    txt += `PROJECT TITLE: ${project.title}\n`;
    txt += `BRANCH: ${project.branch}\n`;
    txt += `COLLEGE: ${project.collegeName}\n`;
    txt += `STUDENT: ${project.studentName}\n`;
    txt += `GUIDE: ${project.guideName}\n`;
    txt += `ACADEMIC YEAR: ${project.academicYear}\n\n`;
    txt += `========================================================================\n\n`;

    project.chapters.forEach(ch => {
      txt += `CHAPTER ${ch.chapterNumber}: ${ch.title.toUpperCase()}\n`;
      txt += `------------------------------------------------------------------------\n`;
      txt += `${ch.content || '[Content pending]'}\n\n\n`;
    });

    this.downloadFile(txt, `${this.sanitizeFilename(project.title)}_BlackBook.txt`, 'text/plain');
  }

  exportToDocx(project: Project): void {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${project.title} - Black Book Report</title>
        <style>
          @page {
            size: A4;
            margin: 1in 1in 1in 1.25in;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000000;
            text-align: justify;
          }
          .title-page {
            text-align: center;
            padding-top: 2in;
            page-break-after: always;
          }
          .title-page h1 {
            font-size: 18pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 0.5in;
          }
          .title-page h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 1in;
          }
          .title-page p {
            font-size: 12pt;
            margin-bottom: 0.25in;
          }
          .certificate-page {
            page-break-after: always;
            margin-top: 1in;
          }
          .certificate-page h2 {
            text-align: center;
            font-size: 16pt;
            text-transform: uppercase;
            text-decoration: underline;
            margin-bottom: 0.5in;
          }
          h1.chapter-title {
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
            text-align: center;
            margin-top: 0.5in;
            margin-bottom: 0.3in;
            page-break-before: always;
          }
          h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 0.25in;
            margin-bottom: 0.15in;
          }
          h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 0.2in;
            margin-bottom: 0.1in;
          }
          p {
            margin-bottom: 0.15in;
            text-indent: 0.5in;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.2in 0;
          }
          table, th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            font-size: 11pt;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          pre, code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            background-color: #f8f9fa;
            padding: 4px;
          }
        </style>
      </head>
      <body>
        <!-- TITLE PAGE -->
        <div class="title-page">
          <h1>${project.title}</h1>
          <p>A PROJECT REPORT SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE DEGREE OF</p>
          <h2>BACHELOR OF ENGINEERING IN ${project.branch.toUpperCase()}</h2>
          <p><strong>SUBMITTED BY:</strong></p>
          <p style="text-transform: uppercase; font-size: 13pt;"><strong>${project.studentName}</strong></p>
          <br/><br/>
          <p><strong>UNDER THE GUIDANCE OF:</strong></p>
          <p><strong>${project.guideName}</strong></p>
          <br/><br/>
          <h2>${project.collegeName.toUpperCase()}</h2>
          <p><strong>ACADEMIC YEAR ${project.academicYear}</strong></p>
        </div>

        <!-- CERTIFICATE PAGE -->
        <div class="certificate-page">
          <h2>CERTIFICATE OF APPROVAL</h2>
          <p style="text-indent:0; text-align: justify; margin-top: 0.5in;">
            This is to certify that the project report entitled <strong>"${project.title}"</strong> submitted by 
            <strong>${project.studentName}</strong> is a bonafide work carried out under my supervision in partial fulfillment 
            of the requirements for the award of the Degree of Bachelor of Engineering in <strong>${project.branch}</strong> 
            at <strong>${project.collegeName}</strong> during the academic year <strong>${project.academicYear}</strong>.
          </p>
          <br/><br/><br/><br/>
          <table style="border:none;">
            <tr style="border:none;">
              <td style="border:none; text-align:left; width:50%;">_______________________<br/><strong>${project.guideName}</strong><br/>Project Guide</td>
              <td style="border:none; text-align:right; width:50%;">_______________________<br/><strong>Head of Department</strong><br/>Department of ${project.branch}</td>
            </tr>
          </table>
        </div>

        <!-- CHAPTERS -->
        ${project.chapters.map(ch => `
          <h1 class="chapter-title">CHAPTER ${ch.chapterNumber}<br/>${ch.title.toUpperCase()}</h1>
          <div>
            ${this.formatMarkdownToHtml(ch.content || '<p><em>Content pending generation.</em></p>')}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const filename = `${this.sanitizeFilename(project.title)}_Academic_BlackBook.doc`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printPdfView(project: Project): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to preview/print the PDF view.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${project.title} - Academic Black Book</title>
        <style>
          @page { size: A4; margin: 25mm 20mm 20mm 25mm; }
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 20px; }
          h1.title { font-size: 20pt; text-align: center; text-transform: uppercase; margin-top: 100px; }
          .center { text-align: center; }
          .page-break { page-break-after: always; }
          h1.ch-header { font-size: 16pt; text-align: center; margin-top: 40px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          table, th, td { border: 1px solid #333; padding: 8px; font-size: 10pt; }
          th { background: #f0f0f0; }
          pre { background: #f4f4f4; padding: 10px; font-family: monospace; }
        </style>
      </head>
      <body>
        <h1 class="title">${project.title}</h1>
        <p class="center" style="font-size: 14pt; margin-top: 40px;">BACHELOR OF ENGINEERING IN ${project.branch.toUpperCase()}</p>
        <p class="center" style="margin-top: 80px;"><strong>Submitted by:</strong> ${project.studentName}</p>
        <p class="center"><strong>Guided by:</strong> ${project.guideName}</p>
        <p class="center" style="margin-top: 100px;"><strong>${project.collegeName}</strong></p>
        <p class="center">Academic Year: ${project.academicYear}</p>
        
        <div class="page-break"></div>

        ${project.chapters.map(ch => `
          <h1 class="ch-header">CHAPTER ${ch.chapterNumber}: ${ch.title.toUpperCase()}</h1>
          <div>${this.formatMarkdownToHtml(ch.content || '<p>Content pending.</p>')}</div>
          <div class="page-break"></div>
        `).join('')}

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  private formatMarkdownToHtml(md: string): string {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private sanitizeFilename(name: string): string {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
  }
}
