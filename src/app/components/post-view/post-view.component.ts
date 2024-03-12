import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseResponse, Comment, Post } from '@core/types/api-response.type';
import { getAvatar } from '@core/utils';
import { PostService } from '@core/services/post.service';
import { HttpResponse } from '@angular/common/http';
import { PostComponent } from '../post/post.component';
import { CommentComponent } from '../comment/comment.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '@core/services/comment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentViewEvent } from '@core/types/miscellaneous.type';
import { CommentViewComponent } from '../comment-view/comment-view.component';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    PostComponent,
    CommentComponent,
  ],
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.scss',
})
export class PostViewComponent {
  post = <Post>{ user: {}, comments: [''], likes: [''] };
  commentForm = this.formBuilder.group({
    content: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ],
    ],
  });
  @ViewChild('commentInput') commentInput!: ElementRef;
  getAvatar = getAvatar;
  comments = <Comment[]>[];
  loading = false;
  noMoreComments = false;
  lastCommentId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private modal: NgbModal,
    public router: Router
  ) {}

  ngOnInit() {
    const postId = <string>this.route.snapshot.paramMap.get('postId');

    this.postService.getPostById(
      postId,
      (response: HttpResponse<BaseResponse<Post>>) => {
        this.post = <Post>(response.body && response.body.data);
        this.loadMoreComments();
      }
    );
  }

  ngAfterViewInit() {
    if (this.route.snapshot.queryParams['action'] === 'comment')
      this.commentInput.nativeElement.focus();
  }

  comment() {
    if (this.commentForm.invalid) return;

    this.postService.comment(
      this.post.id,
      <string>this.commentForm.value.content,
      () => {
        this.commentForm.reset();
        this.noMoreComments = false;
        this.loadMoreComments();
      }
    );
  }

  loadMoreComments() {
    if (this.loading || this.noMoreComments) {
      return;
    }

    this.loading = true;
    this.commentService.getCommentsOfPost(
      this.post.id,
      (response: HttpResponse<BaseResponse<Comment[]>>) => {
        const comments = <Comment[]>(response.body && response.body.data);
        if (comments.length === 0) {
          this.noMoreComments = true;
          this.loading = false;
          return;
        }

        this.comments.push(...comments);
        this.lastCommentId = comments[comments.length - 1].id;
        this.loading = false;
      },
      this.lastCommentId
    );
  }

  openCommentView(event: CommentViewEvent) {
    const modalRef = this.modal.open(CommentViewComponent, {
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.comment = event.comment;
    modalRef.componentInstance.action = event.action;
    modalRef.componentInstance.commentDeleted.subscribe((commentId: string) => {
      this.removeComment(commentId);
    });
  }

  removeComment(commentId: string) {
    this.comments = this.comments.filter((comment) => comment.id !== commentId);
  }
}
