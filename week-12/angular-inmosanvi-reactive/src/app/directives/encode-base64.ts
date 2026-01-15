// Usamos output de angular/core
import { Directive, output } from '@angular/core';

@Directive({
  selector: '[appEncodeBase64]',
  standalone: true,
  // Current syntax: use the “host” property instead of @HostListener.
  host: {
    '(change)': 'onChange($event)',
  },
})
export class EncodeBase64Directive {
  // Current syntax: use the new output() function instead of @Output
  encoded = output<string>();

  // The method no longer requires a decorator; it is linked above in ‘host’.
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.encoded.emit(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      this.encoded.emit('');
    }
  }
}
