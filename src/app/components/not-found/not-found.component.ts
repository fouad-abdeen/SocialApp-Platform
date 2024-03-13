import { Component } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="illustration-container">
      <img src="../../../assets/images/not-found.png" alt="404" />
    </div>
  `,
  styles: [
    `
      .illustration-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .illustration-container img {
        width: 100%;
        max-width: 500px;
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.hide();
  }
}
