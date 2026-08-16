import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService, Plan } from '../../../core/services/payment';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-page.html',
  styleUrl: './pricing-page.scss'
})
export class PricingPage {
  readonly paymentService = inject(PaymentService);
  readonly authService = inject(AuthService);

  upgradingPlanId: string | null = null;
  toastMessage: string = '';

  async onUpgrade(plan: Plan): Promise<void> {
    if (this.authService.currentUser()?.plan === plan.id) {
      alert(`You are currently on the ${plan.name}!`);
      return;
    }

    this.upgradingPlanId = plan.id;
    const res = await this.paymentService.upgradePlan(plan.id);
    this.upgradingPlanId = null;

    if (res.success) {
      this.toastMessage = res.message;
      setTimeout(() => {
        this.toastMessage = '';
      }, 4000);
    }
  }
}
