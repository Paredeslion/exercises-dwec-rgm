import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product';

@Pipe({
  name: 'productFilter',
  standalone: true // Recommended in newer versions of Angular
})
export class ProductFilterPipe implements PipeTransform {
  transform(products: Product[], search?: string): Product[] {
    const searchLower = search?.toLocaleLowerCase();
    return searchLower
      ? products.filter((prod) =>
          prod.description.toLocaleLowerCase().includes(searchLower)
        )
      : products;
  }
}

