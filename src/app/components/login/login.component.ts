import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../core/types/api-requests';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';

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

      .auth-container {
        min-height: 165vh;
      }
    `,
  ],
})
export class LoginComponent {
  readonly loginRequest: LoginRequest;
  showPassword = false;

  constructor(private authService: AuthService, public location: Location) {
    this.loginRequest = new LoginRequest();
  }

  login(): void {
    this.authService.login(this.loginRequest);
  }

  canAttemptLogin(): boolean {
    return !!this.loginRequest.userIdentifier && !!this.loginRequest.password;
  }
}
