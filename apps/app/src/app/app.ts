import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <router-outlet />
  `,
})
export class App {
  protected title = 'app';
}
