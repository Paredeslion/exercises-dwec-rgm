import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlCurrency',
  standalone: true,
})
export class IntlCurrencyPipe implements PipeTransform {
  // Pipe receives currency, language and digits parameters
  transform(value: number, currency: string, language: string, maximumFractionDigits = 0): string {
    // We use the Intl.NumberFormat API to format the currency
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: maximumFractionDigits,
    }).format(value);
  }
}
