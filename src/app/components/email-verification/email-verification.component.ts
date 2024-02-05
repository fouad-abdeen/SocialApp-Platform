import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  providers: [AuthService],
  template: `
    <div class="auth-container">
      <h1>{{ status }}</h1>

      <div class="illustration">
        <img [src]="illustration" alt="SocialApp Illustration" />
      </div>

      <p class="text-center mt-3" *ngIf="verified">
        Your account is activated. You can start using SocialApp now.
      </p>
      <a routerLink="/home" class="text-dark fw-bold" *ngIf="verified"
        >Get Started</a
      >
    </div>
  `,
  styles: [
    `
      .auth-container a {
        cursor: pointer;
      }
    `,
  ],
})
export class EmailVerificationComponent {
  illustration = '../../../assets/images/loading.png';
  status = 'Verifying your Email Address';
  verified = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const { token } = this.route.snapshot.queryParams;
    this.authService.verifyEmailAddress(token, () => {
      this.illustration = '../../../assets/images/email-verified.png';
      this.status = 'Verified your Email Address';
      this.verified = true;
    });
  }
}
