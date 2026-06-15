import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('NgRx-Step-By-Step');

  protected name = 'Peter';

  /**
   *
   */
  constructor() {

    setTimeout(() => {
      this.name = 'Marry';
      console.log(this.name);
    }, 5000);
  }


  doSth() {
    console.log("sth")
  }


}
