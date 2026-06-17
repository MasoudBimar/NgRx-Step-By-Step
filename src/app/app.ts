import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('NgRx-Step-By-Step');


}
