import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    maxLength = 100,
    expandIcon = 'fa fa-expand'
  ): string {
    if (value.length <= maxLength) {
      return value;
    }

    // Find the last space, comma, or dot within the first 100 characters
    const temporaryValue = value.slice(0, maxLength);
    const lastSuitableIndex = Math.max(
      temporaryValue.lastIndexOf(' '),
      temporaryValue.lastIndexOf(','),
      temporaryValue.lastIndexOf('،'),
      temporaryValue.lastIndexOf('.')
    );

    const truncatedValue = value.slice(
      0,
      lastSuitableIndex === -1 ? maxLength : lastSuitableIndex
    );

    // Add expand icon and return truncated value
    return `${truncatedValue}... <i class="${expandIcon}"></i>`;
  }
}

@NgModule({
  declarations: [TruncatePipe],
  exports: [TruncatePipe],
})
export class PipesModule {}
