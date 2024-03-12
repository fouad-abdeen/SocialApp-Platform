import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import {
  BaseResponse,
  UserResponse,
  UserSearch,
} from '@core/types/api-response.type';
import { environment } from '@env/environment';
import { getAvatar } from '@core/utils';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly filesUrl = `${environment.serverUrl}/files`;
  loggedInUser = <UserResponse>{};
  searchResults = <UserSearch[]>[];
  usernameQuery = '';
  getAvatar = getAvatar;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loggedInUser = this.userService.get();
  }

  logout() {
    this.authService.logout();
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
        const { data } = response.body ?? {};

        if (!data || (data && data.length === 0)) {
          this.searchResults = [];
          return;
        }

        this.searchResults = data;
      }
    );
  }

  resetSearch() {
    this.usernameQuery = '';
    this.searchResults = [];
  }
}
