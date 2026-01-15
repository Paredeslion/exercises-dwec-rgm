import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../shared/interfaces/property';
import { IntlCurrencyPipe } from '../../pipes/intl-currency-pipe';

@Component({
  selector: 'property-card',
  standalone: true,
  imports: [IntlCurrencyPipe, RouterLink], // Importing the currency pipe and RouterLink
  templateUrl: './property-card.html',
  styleUrl: './property-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush, // Mandatory in the exercise
  host: {
    'class': 'bg-white rounded-lg shadow-md flex flex-col relative overflow-visible'
  }
})
export class PropertyCard {
  // Receiving the property as a mandatory Signal
  property = input.required<Property>();

  // Trigger event to notify the parent that deletion is required
  deleted = output<void>();

  // Method that triggers the event
  deleteProperty() {
    this.deleted.emit();
  }
}
