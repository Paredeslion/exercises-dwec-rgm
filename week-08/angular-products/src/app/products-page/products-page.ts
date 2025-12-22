import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  resource,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { FormsModule } from '@angular/forms';
import { ProductItem } from '../product-item/product-item';
import { ProductForm } from '../product-form/product-form';
import { ProductsService } from '../services/products-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'products-page',
  standalone: true,
  imports: [FormsModule, ProductItem, ProductForm],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  title = 'Mi lista de productos';

  #productsService = inject(ProductsService);

  // 3. CAMBIO PRINCIPAL: Usamos resource en vez de signal + constructor
  productsResource = resource({
    loader: () => firstValueFrom(this.#productsService.getProducts()),
  });

  // 4. Adaptamos la señal 'products' para que sea fácil de usar en el resto del código
  // Si resource tiene valor, lo usamos. Si no (está cargando), devolvemos array vacío.
  products = computed(() => this.productsResource.value() ?? []);

  // ELIMINADO: Ya no hace falta el constructor con subscribe ni takeUntilDestroyed

  showImage = signal(true);

  search = signal(''); // (Esto requiere importar 'signal' si lo mantienes)

  // Original value
  // newProduct!: Product;
  fileName = '';

  // 5. Ajuste en filteredProducts
  filteredProducts = computed(() => {
    const searchTerm = this.search().toLowerCase();
    // this.products() ahora viene del computed de arriba (punto 4)
    return searchTerm
      ? this.products().filter((p) => p.description.toLowerCase().includes(searchTerm))
      : this.products();
  });

   // 6. Ajuste en addProduct (Optimistic Update)
  addProduct(product: Product) {
    // Para modificar un resource localmente usamos .update()
    this.productsResource.update((currentProducts) => {
      const products = currentProducts ?? []; // Aseguramos que es un array
      // Lógica de ID
      const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id!)) : 0;
      product.id = maxId + 1;

      return [...products, product];
    });
  }

  toggleImage() {
    // Using update to invert the value, if it's true then changes to false
    this.showImage.update((value) => !value);
  }

  deleteProduct(product: Product) {
    this.productsResource.update(products =>
        (products ?? []).filter(p => p.id !== product.id)
    );
  }
}
