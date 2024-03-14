import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { UpdatePasswordRequest } from '@core/types/api-request.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-settings.component.html',
  styles: [],
})
export class AccountSettingsComponent {
  showPasswordUpdateForm = false;
  updatePasswordForm = <UpdatePasswordRequest>{
    currentPassword: '',
    newPassword: '',
    terminateAllSessions: false,
  };
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private ActiveModal: NgbActiveModal
  ) {}

  updatePassword() {
    if (this.updatePasswordForm.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.authService.updatePassword(this.updatePasswordForm, () => {
      this.showPasswordUpdateForm = false;
      this.updatePasswordForm = {
        currentPassword: '',
        newPassword: '',
        terminateAllSessions: false,
      };
      this.confirmPassword = '';
      this.closeModal();
    });
  }

  closeModal() {
    this.ActiveModal.close();
  }
}
