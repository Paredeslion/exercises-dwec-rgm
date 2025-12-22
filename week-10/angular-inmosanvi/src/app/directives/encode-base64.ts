import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appEncodeBase64]',
  standalone: true,
})
export class EncodeBase64Directive {
  // Event that notifies the parent with the converted image (or empty string)
  @Output() encoded = new EventEmitter<string>();

  // We listen for the ‘change’ event of the input where we put the directive.
  @HostListener('change', ['$event']) onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]; // Cogemos el primer archivo

    if (file) {
      // If there is a file, we create the reader.
      const reader = new FileReader();

      // When it finishes reading, we issue the result.
      reader.onload = () => {
        this.encoded.emit(reader.result as string);
      };

      // We start reading the file as a data URL (Base64).
      reader.readAsDataURL(file);
    } else {
      // REQUIREMENT OF THE EXERCISE: If there is no file (the user cancels), we issue an empty string
      this.encoded.emit('');
    }
  }
}
