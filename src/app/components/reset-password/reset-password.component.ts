import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  providers: [AuthService],
  templateUrl: './reset-password.component.html',
  styles: [
    `
      .auth-container {
        min-height: 150vh;
      }
    `,
  ],
})
export class ResetPasswordComponent {
  newPassword = '';
  passwordConfirm = '';
  showPassword = false;
  reset = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.loadingService.hide();
  }

  isAuthenticatedUser(): boolean {
    return this.userService.isAuthenticated();
  }

  resetPassword(): void {
    if (this.newPassword !== this.passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    const { token } = this.route.snapshot.queryParams;

    this.authService.resetPassword(this.newPassword, token, () => {
      alert('Password reset successfully');
      localStorage.removeItem('user');
      localStorage.removeItem('userExpiresAt');
      this.router.navigate(['/login']);
    });
  }
}
