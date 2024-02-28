import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';

  constructor(public userService: UserService) {}

  ngOnInit() {}
}
