import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    if (!this.currentUserSignal()) {
      // Initialize with default demo student account if empty
      const demoUser: User = {
        id: 'std_demo_101',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@engg.edu',
        collegeName: 'Mumbai Institute of Technology',
        branch: 'Computer Engineering',
        plan: 'pro',
        wordCredits: 25000,
        token: 'demo-jwt-token-xyz'
      };
      this.setUser(demoUser);
    }
  }

  private loadUserFromStorage(): User | null {
    try {
      const data = localStorage.getItem('blackbook_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      localStorage.setItem('blackbook_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blackbook_user');
    }
  }

  login(email: string, password: string): { success: boolean; message: string } {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }
    const user: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      collegeName: 'Vidyalankar Institute of Technology',
      branch: 'Computer Engineering',
      plan: 'pro',
      wordCredits: 20000,
      token: 'jwt-auth-session-key'
    };
    this.setUser(user);
    return { success: true, message: 'Login successful!' };
  }

  signup(name: string, email: string, password: string, collegeName: string, branch: string): { success: boolean; message: string } {
    if (!email || !password || !name) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      collegeName: collegeName || 'Engineering College',
      branch: branch || 'Computer Engineering',
      plan: 'free',
      wordCredits: 10000,
      token: 'jwt-auth-session-new'
    };
    this.setUser(newUser);
    return { success: true, message: 'Account created successfully!' };
  }

  logout(): void {
    this.setUser(null);
  }

  deductCredits(amount: number): boolean {
    const current = this.currentUserSignal();
    if (!current) return false;
    if (current.wordCredits < amount) return false;

    const updated = {
      ...current,
      wordCredits: current.wordCredits - amount
    };
    this.setUser(updated);
    return true;
  }
}
