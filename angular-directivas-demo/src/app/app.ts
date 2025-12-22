import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para ngClass/ngStyle en standalone
import { HighlightDirective } from './directives/highlight'; // <--- IMPORTANTE

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HighlightDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Variables para directivas estructurales
  esVisible: boolean = true;
  frutas: string[] = ['Manzana', 'Pera', 'Plátano', 'Kiwi'];
  calificacion = 5;

  // Variable para directiva de atributo (ngClass/ngStyle)
  estadoActivo: boolean = false;

  alternarVisibilidad() {
    this.esVisible = !this.esVisible;
  }
}
