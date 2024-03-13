import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: ` <div *ngIf="loading$ | async" class="loading-spinner">
    <div class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`,
  styles: [
    `
      .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class LoadingComponent {
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
