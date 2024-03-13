import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PipesModule } from '@core/modules/pipes.module';
import { PostService } from '@core/services/post.service';
import { UserService } from '@core/services/user.service';
import { Post, UserResponse } from '@core/types/api-response.type';
import { calculatePassedMinutes, getAvatar, getImage } from '@core/utils';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    PipesModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post = <Post>{ user: {}, comments: [''], likes: [''] };
  @Input() user = <UserResponse>{};
  @Input() viewSource: 'post' | 'elsewhere' = 'post';
  @Output() postDeleted = new EventEmitter<string>();
  @ViewChild('updateButton') updateButton!: ElementRef;
  updateForm = this.formBuilder.group({
    content: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ],
    ],
  });
  isLiked = false;
  updating = false;
  cannotUpdate = false;
  getAvatar = getAvatar;
  getImage = getImage;

  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.user.username && (this.post.user = this.user);
  }

  ngAfterContentInit() {
    const user = this.userService.get();
    this.post.likes.includes(user.id) && (this.isLiked = true);
  }

  ngAfterViewInit() {
    this.updateForm.setValue({
      content: this.post.content,
    });
  }

  like(postId: string) {
    this.postService.like(postId, () => {
      this.isLiked = true;
      this.post.likes.push(this.userService.get().id);
    });
  }

  unlike(postId: string) {
    this.postService.unlike(postId, () => {
      this.isLiked = false;
      this.post.likes = this.post.likes.filter(
        (userId) => userId !== this.userService.get().id
      );
    });
  }

  update() {
    const newContent = <string>this.updateForm.value.content;
    this.postService.update(this.post.id, newContent, () => {
      this.post.content = newContent;
      this.updating = false;
    });
  }

  delete() {
    const canDelete = confirm('Are you sure you want to delete this comment?');
    if (!canDelete) return;
    this.postService.delete(this.post.id, () => {
      this.postDeleted.emit(this.post.id);
    });
  }

  attemptUpdate() {
    if (this.cannotUpdate) {
      this.updating = false;
      return;
    }
    this.updating = !this.updating;
  }

  canUpdate() {
    const leftMinutesForUpdate =
      60 - calculatePassedMinutes(this.post.createdAt);

    if (leftMinutesForUpdate > 0)
      this.updateButton.nativeElement.title = `${leftMinutesForUpdate} minutes left to update`;
    else {
      this.updateButton.nativeElement.title =
        'You can not update a post after 60 minutes of submission';
      this.updateButton.nativeElement.style.cursor = 'not-allowed';
      this.cannotUpdate = true;
    }
  }

  isPostOwner() {
    return this.userService.get().username === this.post.user.username;
  }
}
