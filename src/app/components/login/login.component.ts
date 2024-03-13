import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../core/types/api-request.type';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';

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

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    public location: Location
  ) {
    this.loginRequest = new LoginRequest();
  }

  ngOnInit(): void {
    this.loadingService.hide();
  }

  login(): void {
    this.authService.login(this.loginRequest);
  }

  canAttemptLogin(): boolean {
    return !!this.loginRequest.userIdentifier && !!this.loginRequest.password;
  }
}
