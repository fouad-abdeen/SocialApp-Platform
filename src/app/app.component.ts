import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { UserService } from '@core/services/user.service';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { SocketService } from '@core/services/socket.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    LoadingComponent,
    NgbAlertModule,
  ],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public notficationMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    public userService: UserService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('user');

    this.socketService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        if (message) {
          this.notficationMessage = message;
          setTimeout(() => {
            this.notficationMessage = '';
          }, 5000);
        }
      });

    if (user) this.socketService.connect(JSON.parse(user).id);
  }

  ngOnDestroy() {
    this.socketService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
