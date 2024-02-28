import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { BaseResponse, UserSearch } from '@core/types/api-responses';
import { environment } from '@env/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly filesUrl = `${environment.serverUrl}/files`;
  usernameQuery: string = '';
  searchResults: UserSearch[] = [];

  constructor(
    public userService: UserService,
    public authService: AuthService
  ) {}

  getAvatar(avatar?: string): string {
    return avatar
      ? `${environment.serverUrl}/files?id=${avatar}`
      : '../../../assets/images/avatar.png';
  }

  searchForUsers() {
    if (!this.usernameQuery) {
      this.searchResults = [];
      return;
    }
    this.userService.search(
      this.usernameQuery,
      undefined,
      (response: HttpResponse<BaseResponse<UserSearch[]>>) => {
        this.searchResults = (response.body ?? {}).data ?? [];
      }
    );
  }

  setSearch(value: string) {
    this.usernameQuery = value;
    this.searchResults = [];
  }
}
