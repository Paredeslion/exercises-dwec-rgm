import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [],
  // Vinculamos al archivo HTML externo
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  host: {
    class: 'grow flex items-center justify-center',
  },
})
export class LoginPage {
  #router = inject(Router);
  #title = inject(Title);

  constructor() {
    this.#title.setTitle('Login | InmoSanvi');
  }

  login(event: Event) {
    event.preventDefault(); // Evitamos recarga del form
    this.#router.navigate(['/properties']);
  }
}
