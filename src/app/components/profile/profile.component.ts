import { Component, HostListener } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@core/services/user.service';
import {
  BaseResponse,
  Post,
  UserResponse,
} from '@core/types/api-response.type';
import { HttpResponse } from '@angular/common/http';
import { getAvatar } from '@core/utils';
import { CommonModule } from '@angular/common';
import { PostSubmitComponent } from '../post-submit/post-submit.component';
import { PostService } from '@core/services/post.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent, PostSubmitComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  loggedInUser = <UserResponse>{};
  user = <UserResponse>{};
  getAvatar = getAvatar;
  posts: Post[] = [];
  loading = false;
  noMorePosts = false;
  lastPostId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    const username = <string>this.route.snapshot.paramMap.get('username');
    const loggedInUser = this.userService.get();

    if (username === loggedInUser.username) {
      this.loggedInUser = loggedInUser;
      this.user = this.loggedInUser;
      this.loadMorePosts();
    } else
      this.userService.getByUsername(
        username,
        (response: HttpResponse<BaseResponse<UserResponse>>) => {
          this.user = <UserResponse>(response.body && response.body.data);
          this.loadMorePosts();
        }
      );
  }

  editAvatar() {}

  deleteAvatar() {}

  loadMorePosts() {
    if (this.loading || this.noMorePosts) {
      return;
    }

    this.loading = true;

    this.postService.getUserPosts(
      this.user.id,
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

  addPost(post: Post) {
    this.posts = [post, ...this.posts];
  }

  removePost(postId: string) {
    this.posts = this.posts.filter((post) => post.id !== postId);
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
