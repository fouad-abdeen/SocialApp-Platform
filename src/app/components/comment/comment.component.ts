import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PipesModule } from '@core/modules/pipes.module';
import { CommentService } from '@core/services/comment.service';
import { UserService } from '@core/services/user.service';
import { Comment } from '@core/types/api-response.type';
import { calculatePassedMinutes, getAvatar } from '@core/utils';
import { CommentViewEvent } from '@core/types/miscellaneous.type';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    PipesModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input() comment = <Comment>{ user: {} };
  @Input() viewSource: 'comment' | 'post' = 'post';
  @Output() viewRequested = new EventEmitter<CommentViewEvent>();
  @Output() replyClicked = new EventEmitter<null>();
  @Output() commentDeleted = new EventEmitter<string>();
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

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.updateForm.setValue({
      content: this.comment.content,
    });
  }

  like(commentId: string) {
    this.commentService.like(commentId, () => {
      this.isLiked = true;
      this.comment.likes.push(this.userService.get().id);
    });
  }

  unlike(commentId: string) {
    this.commentService.unlike(commentId, () => {
      this.isLiked = false;
      this.comment.likes = this.comment.likes.filter(
        (userId) => userId !== this.userService.get().id
      );
    });
  }

  view(action: 'view' | 'reply') {
    this.viewRequested.emit({
      comment: this.comment,
      action,
    });
  }

  reply() {
    this.replyClicked.emit();
  }

  update() {
    const newContent = <string>this.updateForm.value.content;
    this.commentService.update(this.comment.id, newContent, () => {
      this.comment.content = newContent;
      this.updating = false;
    });
  }

  delete() {
    const canDelete = confirm('Are you sure you want to delete this comment?');
    if (!canDelete) return;
    this.commentService.delete(this.comment.id, () => {
      this.commentDeleted.emit(this.comment.id);
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
      30 - calculatePassedMinutes(this.comment.createdAt);

    if (leftMinutesForUpdate > 0)
      this.updateButton.nativeElement.title = `${leftMinutesForUpdate} minutes left to update`;
    else {
      this.updateButton.nativeElement.title = 'You can not update this comment';
      this.updateButton.nativeElement.style.cursor = 'not-allowed';
      this.cannotUpdate = true;
    }
  }

  isCommentOwner() {
    return this.userService.get().username === this.comment.user.username;
  }
}
