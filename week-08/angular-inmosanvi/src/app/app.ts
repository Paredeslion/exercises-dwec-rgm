import { Component, signal } from '@angular/core';
import { PropertiesPage } from './properties-page/properties-page';

@Component({
  selector: 'app-root',
  imports: [PropertiesPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-inmosanvi');
}
