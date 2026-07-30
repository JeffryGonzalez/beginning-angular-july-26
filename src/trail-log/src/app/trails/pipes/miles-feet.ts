import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milesFeet',
})
export class MilesToFeetPipe implements PipeTransform {
  transform(miles: number): string {
    const feet = miles * 5280;
    return `${miles} miles (${feet.toLocaleString()} feet)`;
  }
}
