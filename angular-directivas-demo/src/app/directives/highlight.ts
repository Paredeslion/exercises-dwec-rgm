import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  // Recibimos el color desde fuera.
  // Al llamarlo igual que el selector ('appHighlight'), podemos usarlo directamente.
  @Input() appHighlight = '';

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    // Usamos el color que nos pasen, o 'yellow' por defecto si no pasan nada
    this.cambiarColor(this.appHighlight || 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiarColor('');
  }

  private cambiarColor(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
