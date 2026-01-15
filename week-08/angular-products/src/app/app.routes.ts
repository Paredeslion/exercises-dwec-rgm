import { Routes } from '@angular/router';
// Importamos los componentes que gestionarán cada vista
import { ProductsPage } from './products-page/products-page';
import { ProductDetail } from './product-detail/product-detail';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
  { path: 'products', component: ProductsPage, title: 'Productos | Angular Products' },
  { path: 'products/add', component: ProductForm, title: 'Añadir producto | Angular Products' },
  { path: 'products/:id', component: ProductDetail },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  // Aquí podríamos cargar un página de error 404 por ejemplo
  { path: '**', redirectTo: '/products' },
];
