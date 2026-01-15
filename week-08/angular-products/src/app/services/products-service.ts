import { Injectable, inject, Signal } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, map } from 'rxjs';
import { ProductsResponse, SingleProductResponse } from '../interfaces/responses';
import { HttpClient, httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  #productsUrl = 'products';
  #http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.#http
      .get<ProductsResponse>(`${this.#productsUrl}`)
      .pipe(map((resp) => resp.products));
  }

  changeRating(idProduct: number, rating: number): Observable<void> {
    return this.#http.put<void>(`${this.#productsUrl}/${idProduct}/rating`, {
      rating: rating,
    });
  }

  insertProduct(product: Product): Observable<Product> {
    return this.#http
      .post<SingleProductResponse>(this.#productsUrl, product)
      .pipe(map((resp) => resp.product));
  }

  deleteProduct(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#productsUrl}/${id}`);
  }

  // Resource compartido para la aplicación
  readonly productsResource = httpResource<ProductsResponse>(() => `products`, {
    defaultValue: { products: [] },
  });

  // Resource en base a su id (método factory -> resource personalizado)
  getProductIdResource(id: Signal<number>) {
    return httpResource<SingleProductResponse>(() => `${this.#productsUrl}/${id()}`);
  }
}
