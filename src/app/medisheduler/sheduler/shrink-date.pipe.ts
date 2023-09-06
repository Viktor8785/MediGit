import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shrinkDate'
})
export class ShrinkDatePipe implements PipeTransform {
  
  transform(date: Date): string {
    const day = date.getDay();
    const dateValue = date.getDate();
    const month = date.getMonth();
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    return days[day] + ' ' + dateValue + ' ' + months[month];
  }
}
