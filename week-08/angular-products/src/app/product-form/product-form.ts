import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  output,
  inject,
  DestroyRef,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../interfaces/product';
import { ProductsService } from '../services/products-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  add = output<Product>();

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
  #destroyRef = inject(DestroyRef);

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
  addProduct(productForm: NgForm) {
    this.#productsService
      .insertProduct(this.newProduct)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((product) => {
        this.add.emit(product); // Emitimos el producto (con id) devuelto por el servidor
        productForm.resetForm(); // Reseteamos los campos de newProduct
        this.newProduct.imageUrl = ''; // La imagen también (no está vinculada al formulario)
      });
  }
}
