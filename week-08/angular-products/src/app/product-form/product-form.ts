import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import { FormsModule,  } from '@angular/forms';
import { Product } from '../interfaces/product';
import { ProductsService } from '../services/products-service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {

  newProduct: Product = {
    // Asignamos directamente
    id: 0,
    description: '',
    available: '',
    imageUrl: '',
    rating: 1,
    price: 0,
  };

  #changeDetector = inject(ChangeDetectorRef);
  #productsService = inject(ProductsService);
  #router = inject(Router);

  changeImage(fileInput: HTMLInputElement) {
    // Referencia directa al input
    if (!fileInput.files?.length) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newProduct.imageUrl = reader.result as string; // Asynchronous change
      this.#changeDetector.markForCheck(); // Marking component as dirty
    });
  }

  // Este método cambia (no gestionamos la inserción en el array de productos)
  addProduct() { // No necesitamos el formulario (NgForm) para resetearlo
    this.#productsService
      .insertProduct(this.newProduct)
      .subscribe(() => this.#router.navigate(['/products']));
  }
}
