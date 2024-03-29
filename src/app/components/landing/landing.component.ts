import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgbAlertModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  constructor(private router: Router, private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.hide();
  }

  navigateToLogin() {
    this.router.navigate(['/login'], { state: { skipAuth: true } });
  }

  navigateToSignup() {
    this.router.navigate(['/signup'], { state: { skipAuth: true } });
  }
}
