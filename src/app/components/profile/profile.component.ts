import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PostComponent } from '../shared/post/post.component';
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
import { PostSubmitComponent } from '../shared/post-submit/post-submit.component';
import { PostService } from '@core/services/post.service';
import { LoadingService } from '@core/services/loading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { ConnectionsListComponent } from '../connections-list/connections-list.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent, PostSubmitComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @ViewChild('avatar') avatar!: ElementRef;
  loggedInUser = <UserResponse>{};
  user = <UserResponse>{ posts: [''], followers: [''], followings: [''] };
  getAvatar = getAvatar;
  posts: Post[] = [];
  loading = false;
  noMorePosts = false;
  lastPostId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postService: PostService,
    private loadingService: LoadingService,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    const username = <string>this.route.snapshot.paramMap.get('username');

    if (!username) return;

    this.loggedInUser = this.userService.get();
    this.loadingService.show();

    if (username === this.loggedInUser.username) {
      this.loadingService.hide();
      this.user = this.loggedInUser;
      this.loadMorePosts();
    } else
      this.userService.getByUsername(
        username,
        (response: HttpResponse<BaseResponse<UserResponse>>) => {
          this.loadingService.hide();
          this.user = <UserResponse>(response.body && response.body.data);
          this.loadMorePosts();
        }
      );
  }

  followUser(): void {
    if (this.loggedInUser.followings.includes(this.user.id)) return;
    this.userService.follow(this.user.id, () => {
      this.user.followers.push(this.loggedInUser.id);
      this.loggedInUser.followings.push(this.user.id);
      this.userService.set(this.loggedInUser);
    });
  }

  unfollowUser(): void {
    if (!this.loggedInUser.followings.includes(this.user.id)) return;
    this.userService.unfollow(this.user.id, () => {
      this.user.followers = this.user.followers.filter(
        (followerId) => followerId !== this.loggedInUser.id
      );
      this.loggedInUser.followings = this.loggedInUser.followings.filter(
        (followingId) => followingId !== this.user.id
      );
      this.userService.set(this.loggedInUser);
    });
  }

  editProfile(): void {
    if (this.user.id !== this.loggedInUser.id) return;
    const modalRef = this.modal.open(ProfileEditComponent, {
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.user = { ...this.user };
    modalRef.componentInstance.avatar = this.avatar.nativeElement.src;
    modalRef.componentInstance.avatarUpdated.subscribe((avatar: string) => {
      this.avatar.nativeElement.src = avatar;
    });
    modalRef.componentInstance.avatarDeleted.subscribe(() => {
      this.avatar.nativeElement.src = getAvatar();
    });
    modalRef.componentInstance.profileEdited.subscribe((user: UserResponse) => {
      this.user = user;
      this.userService.set(user);
    });
  }

  openAccountSettings() {
    const modalRef = this.modal.open(AccountSettingsComponent, {
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  seeFollowers() {
    const modalRef = this.modal.open(ConnectionsListComponent, {
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.connectionsType = 'followers';
    modalRef.componentInstance.userId = this.user.id;
    modalRef.componentInstance.firstName = this.user.firstName;
  }

  seeFollowings() {
    const modalRef = this.modal.open(ConnectionsListComponent, {
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.connectionsType = 'followings';
    modalRef.componentInstance.userId = this.user.id;
    modalRef.componentInstance.firstName = this.user.firstName;
  }

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
