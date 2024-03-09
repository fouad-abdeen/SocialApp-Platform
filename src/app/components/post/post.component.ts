import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '@core/services/post.service';
import { UserService } from '@core/services/user.service';
import { Post } from '@core/types/api-responses';
import { getAvatar, getImage } from '@core/utils';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post = <Post>{ user: {} };
  isLikedPost = false;
  getAvatar = getAvatar;
  getImage = getImage;

  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const user = this.userService.get();
    if (this.post.likes.includes(user.id)) this.isLikedPost = true;
  }

  like(postId: string) {
    this.postService.like(postId, () => {
      this.isLikedPost = true;
      this.post.likes.push(this.userService.get().id);
    });
  }

  unlike(postId: string) {
    this.postService.unlike(postId, () => {
      this.isLikedPost = false;
      this.post.likes = this.post.likes.filter(
        (userId) => userId !== this.userService.get().id
      );
    });
  }
}
