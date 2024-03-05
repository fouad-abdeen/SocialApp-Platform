import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Post } from '@core/types/api-responses';
import { getAvatar, getImage } from '@core/utils';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post = <Post>{ user: {} };
  getAvatar = getAvatar;
  getImage = getImage;
}
