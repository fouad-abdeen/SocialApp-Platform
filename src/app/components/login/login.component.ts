import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../core/types/api-requests';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styles: [
    `
      h1 {
        margin-bottom: 20px;
      }
    `,
  ],
})
export class LoginComponent {
  readonly loginRequest: LoginRequest;
  showPassword = false;

  constructor(private authService: AuthService) {
    this.loginRequest = new LoginRequest();
  }

  login(): void {
    this.authService.login(this.loginRequest);
  }

  canAttemptLogin(): boolean {
    return !!this.loginRequest.userIdentifier && !!this.loginRequest.password;
  }
}