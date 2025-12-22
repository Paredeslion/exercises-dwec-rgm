import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../pipes/intl-currency-pipe';
import { StarRating } from '../star-rating/star-rating';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../services/products-service';
@Component({
  selector: 'product-item',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, IntlCurrencyPipe, StarRating],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItem {
  product = input.required<Product>(); // required (obligatorio)
  showImage = input(true);

  deleted = output<void>();

  deleteProduct() {
    this.#productsService
      .deleteProduct(this.product().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.deleted.emit());
  }

  #changeDetector = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);

  #productsService = inject(ProductsService);

  changeRating(rating: number) {
    const oldRating = this.product().rating; // Guardamos puntuación actual
    this.product().rating = rating; // Modificamos antes de la llamada
    this.#productsService
      .changeRating(this.product().id!, rating)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: () => {
          // Ha habido un error (puntuación no cambiada en el servidor)
          this.product().rating = oldRating; // Restauramos puntuación
          this.#changeDetector.markForCheck(); // Detectar cambio
        },
      });
  }
}
