import { NgModule } from '@angular/core';
import { TruncatePipe } from '@core/pipes/truncate.pipe';

@NgModule({
  declarations: [TruncatePipe],
  exports: [TruncatePipe],
})
export class PipesModule {}
