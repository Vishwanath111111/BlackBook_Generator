import { Injectable, signal } from '@angular/core';

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
  wordCredits: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  readonly plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Student Pass',
      price: '₹0',
      period: 'forever',
      wordCredits: 10000,
      features: [
        '1 Complete Black Book Project',
        '7 Standard Academic Chapters',
        'Word Count Selector (Short 400w)',
        'Basic Markdown & TXT Export'
      ]
    },
    {
      id: 'pro',
      name: 'Student Pro',
      price: '₹299',
      period: 'per project',
      popular: true,
      wordCredits: 50000,
      features: [
        'Unlimited Project Revisions',
        'All 8 Chapters + References',
        'Full Word Count Control (400w, 700w, 1000w)',
        'Automatic UML & Diagram Code (Mermaid)',
        'University Formatted DOCX & PDF Export',
        'IEEE Citation Generator'
      ]
    },
    {
      id: 'unlimited',
      name: 'Department / Team Pass',
      price: '₹799',
      period: 'academic year',
      wordCredits: 200000,
      features: [
        'Up to 5 Students / Team Projects',
        'Priority AI Generation Speed',
        'Custom College Template Branding',
        'Full DOCX, PDF, MD, HTML Exports',
        'Dedicated WhatsApp & Email Support'
      ]
    }
  ];

  upgradePlan(planId: string): Promise<{ success: boolean; message: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Successfully upgraded to ${planId.toUpperCase()} plan!`
        });
      }, 1000);
    });
  }
}
