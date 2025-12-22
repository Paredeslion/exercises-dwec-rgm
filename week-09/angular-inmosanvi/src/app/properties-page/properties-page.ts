import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { Property } from '../interfaces/property';
import { PropertyCard } from '../property-card/property-card';
import { PropertyForm } from '../property-form/property-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, PropertyForm, FormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPage {
  // Now properties is a signal
  properties = signal<Property[]>([
    {
      id: 1,
      title: 'Maravillosa vivienda',
      address: 'Calle pintoresca 43',
      town: 'Alcorcón',
      province: 'Madrid',
      price: 950000,
      sqmeters: 240,
      numRooms: 5,
      numBaths: 3,
      mainPhoto: 'images/property1.webp', // Ensure you have this image or use a placeholder
    },
    {
      id: 2,
      title: 'Pisazo no apto para pobres',
      address: 'Carrer dels rics 104',
      town: 'Gavà',
      province: 'Barcelona',
      price: 1200000,
      sqmeters: 180,
      numRooms: 4,
      numBaths: 3,
      mainPhoto: 'images/property2.webp',
    },
  ]);

  // Signals for filters
  search = signal<string>('');
  province = signal<string>('');

  // Computed signal to filter properties automatically
  filteredProperties = computed(() => {
    const searchText = this.search().toLowerCase();
    const provinceFilter = this.province();

    return this.properties().filter((p) => {
      // Check text filter (title or description/address)
      const matchesText = p.title.toLowerCase().includes(searchText) || p.address.toLowerCase().includes(searchText);

      // Check province filter
      const matchesProvince = provinceFilter ? p.province === provinceFilter : true;

      return matchesText && matchesProvince;
    });
  });

  // Method to add a new property (received from the form component)
  addProperty(newProperty: Property) {
    // Generate a new ID based on the max existing ID
    const maxId = this.properties().reduce((max, p) => (p.id && p.id > max ? p.id : max), 0);
    newProperty.id = maxId + 1;

    // Update the signal creating a NEW array (immutable update)
    this.properties.update(props => [...props, newProperty]);
  }

  // Method to delete a property (received from the card component)
  deleteProperty(id: number) {
    // Filter out the property with the given ID [cite: 46]
    this.properties.update(props => props.filter(p => p.id !== id));
  }
}
