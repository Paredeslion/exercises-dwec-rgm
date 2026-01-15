import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'top-menu',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow fixed h-16 flex items-center w-full z-10 top-0">
      <div class="container mx-auto px-4 flex gap-4 justify-between items-center">
        <div class="flex items-baseline gap-3">
          <a
            routerLink="/properties"
            class="text-3xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            InmoSanvi
          </a>
          <p class="text-gray-600 hidden lg:block">Find your dream home</p>
        </div>

        <nav class="flex gap-3">
          <a
            routerLink="/properties"
            routerLinkActive="font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-gray-600 hover:text-gray-900"
          >
            Home
          </a>

          <a
            routerLink="/properties/add"
            routerLinkActive="font-semibold"
            class="text-gray-600 hover:text-gray-900"
          >
            New Property
          </a>

          <a
            routerLink="/auth/login"
            routerLinkActive="text-gray-900"
            class="text-gray-600 hover:text-gray-900"
            title="login"
          >
            <svg class="icon" width="24" height="24">
              <use href="/icons/login.svg#login"></use>
            </svg>
          </a>

          <a class="text-gray-600 hover:text-gray-900 hidden" href="#" title="profile">
            <svg class="icon" width="24" height="24">
              <use href="/icons/profile.svg#profile"></use>
            </svg>
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: ``
})
export class TopMenu {}
