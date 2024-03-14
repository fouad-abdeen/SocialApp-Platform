import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { BaseResponse, UserResponse } from '@core/types/api-response.type';
import { getAvatar } from '@core/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-connections-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './connections-list.component.html',
  styleUrl: './connections-list.component.scss',
})
export class ConnectionsListComponent {
  @Input() connectionsType!: 'followers' | 'followings';
  @Input() userId!: string;
  @Input() firstName!: string;
  lastDocumentId: string | undefined;
  connections: UserResponse[] = [];
  loggedInUser = <UserResponse>{};
  loading = false;
  noMoreConnections = false;
  getAvatar = getAvatar;

  constructor(
    private userService: UserService,
    private ActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.loadMoreConnections();
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

  loadMoreConnections() {
    if (this.loading || this.noMoreConnections) {
      return;
    }

    this.loading = true;

    const callback = (response: HttpResponse<BaseResponse<UserResponse[]>>) => {
      const { data } = response.body ?? {};

      if (!data || (data && data.length === 0)) {
        this.loading = false;
        this.noMoreConnections = true;
        return;
      }

      this.loading = false;
      this.connections = [...this.connections, ...data];
      this.lastDocumentId = data[data.length - 1].id;
    };

    if (this.connectionsType === 'followers')
      this.userService.getFollowers(callback, this.userId, this.lastDocumentId);
    else
      this.userService.getFollowings(
        callback,
        this.userId,
        this.lastDocumentId
      );
  }

  closeModal() {
    this.ActiveModal.close();
  }
}
