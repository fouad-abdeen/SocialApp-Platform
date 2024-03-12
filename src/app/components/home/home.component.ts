import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { PostSubmitComponent } from '../post-submit/post-submit.component';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { BaseResponse, Post } from '@core/types/api-response.type';
import { PostService } from '@core/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostComponent, PostSubmitComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  posts: Post[] = [];
  loading = false;
  noMorePosts = false;
  lastPostId: string | undefined;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.loadMorePosts();
  }

  onPostSubmit(post: Post) {
    this.router.navigate(['/post', post.id]);
  }

  loadMorePosts() {
    if (this.loading || this.noMorePosts) {
      return;
    }

    this.loading = true;

    this.postService.getTimelinePosts(
      (response: HttpResponse<BaseResponse<Post[]>>) => {
        const { data } = response.body ?? {};

        if (!data || (data && data.length === 0)) {
          this.loading = false;
          this.noMorePosts = true;
          return;
        }

        this.posts = [...this.posts, ...data];
        this.lastPostId = data[data.length - 1].id;
        this.loading = false;
        this.noMorePosts = false;
      },
      this.lastPostId
    );
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY * 1.1 >=
      document.body.offsetHeight
    ) {
      this.loadMorePosts();
    }
  }
}
