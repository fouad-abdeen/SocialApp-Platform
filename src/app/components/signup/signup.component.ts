import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SignupRequest } from '../../core/types/api-request.type';
import { CommonModule, Location } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styles: [
    `
      h1 {
        margin-bottom: 20px;
      }

      .auth-container {
        min-height: 240vh;
      }
    `,
  ],
})
export class SignupComponent {
  readonly signupRequest: SignupRequest & { passwordConfirm?: string };
  showPassword = false;
  signedUp = false;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    public location: Location
  ) {
    this.signupRequest = new SignupRequest();
  }

  ngOnInit(): void {
    this.loadingService.hide();
  }

  signup(): void {
    if (this.signupRequest.password !== this.signupRequest.passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    const { passwordConfirm, ...data } = this.signupRequest;
    this.authService.signup(data, () => {
      this.signedUp = true;
    });
  }

  canAttemptSignup(): boolean {
    return (
      !!this.signupRequest.firstName &&
      !!this.signupRequest.lastName &&
      !!this.signupRequest.username &&
      !!this.signupRequest.email &&
      !!this.signupRequest.password &&
      !!this.signupRequest.passwordConfirm
    );
  }
}
