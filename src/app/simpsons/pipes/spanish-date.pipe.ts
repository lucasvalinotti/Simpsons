import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'spanishDate', standalone: true })
export class SpanishDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {

    const date = value?.trim();
    if (!date) return 'Desconocido';

    const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(date);
    if (!match) return date;

    const [, year, month, day] = match;
    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);
    const daysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate();
    if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > daysInMonth) return date;

    return `${day}/${month}/${year}`;
  }
}
