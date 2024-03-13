import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '@core/services/loading.service';
import { UserService } from '@core/services/user.service';
import { UserResponse } from '@core/types/api-response.type';
import { getAvatar } from '@core/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent {
  @Input() user = <UserResponse>{};
  @Input() avatar = '';
  @Output() avatarUpdated = new EventEmitter<string>();
  @Output() avatarDeleted = new EventEmitter<string>();
  @Output() profileEdited = new EventEmitter<UserResponse>();
  @ViewChild('avatarImage') avatarImage!: ElementRef;
  @ViewChild('avatarInput') avatarInput!: ElementRef;
  style = 'display: none';

  constructor(
    private userService: UserService,
    private loadingService: LoadingService,
    private activeModal: NgbActiveModal
  ) {}

  updateAvatar(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.loadingService.show();
      this.userService.updateAvatar(
        file,
        () => {
          this.user = this.userService.get();
          const newAvatar = getAvatar(this.user.avatar);
          const newImageSource = `${newAvatar}&t=${new Date().getTime()}`;
          this.avatarImage.nativeElement.src = newImageSource;
          this.avatarUpdated.emit(newImageSource);
          this.loadingService.hide();
        },
        () => {
          this.avatarInput.nativeElement.value = '';
          this.loadingService.hide();
        }
      );
    }
  }

  deleteAvatar() {
    if (this.user.avatar === '') return;
    const deleteAvatar = confirm(
      'Are you sure you want to delete your avatar?'
    );
    if (!deleteAvatar) return;
    this.userService.deleteAvatar(() => {
      this.avatarImage.nativeElement.src = getAvatar();
      this.avatarDeleted.emit();
    });
  }

  editProfile() {
    this.loadingService.show();
    this.userService.editProfile(
      {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        bio: this.user.bio,
      },
      () => {
        this.loadingService.hide();
        this.profileEdited.emit(this.user);
        this.activeModal.close('Close click');
      },
      () => {
        this.loadingService.hide();
      }
    );
  }

  closeModal() {
    // const close = window.confirm(
    //   'Are you sure you want to discard your changes?'
    // );
    // if (!close) return;
    this.activeModal.close('Close click');
  }
}
