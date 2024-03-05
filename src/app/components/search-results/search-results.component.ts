import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { BaseResponse, UserSearch } from '@core/types/api-responses';
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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'];
      this.loadMoreResults();
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

        this.searchResults = [...this.searchResults, ...data];
        this.lastDocumentId = data[data.length - 1].id;
        this.loading = false;
      }
    );
  }

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     this.loadMoreResults();
  //   }
  // }
}
