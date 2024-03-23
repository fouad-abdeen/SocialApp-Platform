import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseResponse, Comment } from '@core/types/api-response.type';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from '../shared/comment/comment.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { getAvatar } from '@core/utils';
import { CommentService } from '@core/services/comment.service';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-comment-view',
  standalone: true,
  imports: [
    CommonModule,
    CommentComponent,
    ReactiveFormsModule,
    NgbModalModule,
  ],
  templateUrl: './comment-view.component.html',
  styleUrl: './comment-view.component.scss',
})
export class CommentViewComponent {
  @Input() comment = <Comment>{ user: {}, replies: [{}] };
  @Input() action = 'view';
  @Output() commentDeleted = new EventEmitter<string>();
  @ViewChild('replyInput') replyInput!: ElementRef;
  replyForm = this.formBuilder.group({
    content: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ],
    ],
  });
  getAvatar = getAvatar;
  replies = <Comment[]>[];
  loading = false;
  noMoreReplies = false;
  lastReplyId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private userService: UserService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.loadMoreReplies();
  }

  ngAfterViewInit() {
    if (this.action === 'reply') {
      this.focusOnReply();
    }
  }

  focusOnReply() {
    this.replyInput.nativeElement.focus();
  }

  reply() {
    if (this.replyForm.invalid) return;

    this.commentService.reply(
      this.comment.id,
      <string>this.replyForm.value.content,
      (response: HttpResponse<BaseResponse<Comment>>) => {
        const reply = <Comment>(response.body && response.body.data);
        this.comment.replies.push(reply.id);
        this.replyForm.reset();
        this.noMoreReplies = false;
        this.loadMoreReplies();
      }
    );
  }

  loadMoreReplies() {
    if (this.loading || this.noMoreReplies) {
      return;
    }

    this.loading = true;
    this.commentService.getRepliesOfComment(
      this.comment.id,
      (response: HttpResponse<BaseResponse<Comment[]>>) => {
        const replies = <Comment[]>(response.body && response.body.data);
        if (replies.length === 0) {
          this.noMoreReplies = true;
          this.loading = false;
          return;
        }

        this.replies.push(...replies);
        this.lastReplyId = replies[replies.length - 1].id;
        this.loading = false;
      },
      this.lastReplyId
    );
  }

  removeReply(replyId: string) {
    const reply = this.replies.find((reply) => reply.id === replyId);
    if (!reply) return;
    this.comment.replies = this.comment.replies.filter(
      (replyId) => replyId !== reply.id
    );
    this.replies = this.replies.filter((reply) => reply.id !== replyId);
  }

  removeComment(commentId: string) {
    this.commentDeleted.emit(commentId);
    this.closeModal();
  }

  closeModal() {
    if ((this.replyForm.value.content ?? '').length > 0) {
      const close = window.confirm(
        'Are you sure you want to close the comment?'
      );
      if (!close) return;
    }
    this.activeModal.close('Close click');
  }
}
