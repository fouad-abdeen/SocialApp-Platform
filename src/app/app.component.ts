import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';

  constructor() {}

  ngOnInit() {}
}
