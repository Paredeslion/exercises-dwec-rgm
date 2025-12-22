import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductsPage } from './products-page/products-page';

@Component({
  selector: 'app-root',
  imports: [ProductsPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular Products');
}
