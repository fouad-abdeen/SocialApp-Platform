import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './forgot-password.component.html',
  styles: [
    `
      h1 {
        margin-bottom: 20px;
      }

      .auth-container {
        min-height: 120vh;
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  email = '';
  requestedPasswordReset = false;

  constructor(private authService: AuthService) {}

  requestPasswordReset(): void {
    this.authService.requestPasswordReset(this.email, () => {
      this.requestedPasswordReset = true;
    });
  }

  isValidEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }
}
