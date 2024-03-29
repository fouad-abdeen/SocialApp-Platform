import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { UserService } from '@core/services/user.service';
import {
  BaseResponse,
  UserResponse,
  UserSearch,
} from '@core/types/api-response.type';
import { getAvatar } from '@core/utils';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  query = '';
  lastDocumentId: string | undefined;
  searchResults: UserSearch[] = [];
  noMoreResults = false;
  loading = false;
  getAvatar = getAvatar;
  loggedInUser = <UserResponse>{};

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.show();
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'];
      this.loadMoreResults();
    });
    this.loggedInUser = this.userService.get();
  }

  followUser(userId: string): void {
    this.userService.follow(userId, () => {
      this.loggedInUser = this.userService.get();
    });
  }

  unfollowUser(userId: string): void {
    this.userService.unfollow(userId, () => {
      this.loggedInUser = this.userService.get();
    });
  }

  loadMoreResults() {
    if (this.loading || this.noMoreResults) {
      return;
    }

    this.loading = true;

    this.userService.search(
      this.query,
      this.lastDocumentId,
      (response: HttpResponse<BaseResponse<UserSearch[]>>) => {
        const { data } = response.body ?? {};

        if (!data || (data && data.length === 0)) {
          this.loading = false;
          this.noMoreResults = true;
          return;
        }

        this.loadingService.hide();
        this.searchResults = [...this.searchResults, ...data];
        this.lastDocumentId = data[data.length - 1].id;
        this.loading = false;
      }
    );
  }
}
