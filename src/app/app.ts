import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Item } from './models/item.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('NgRx-Step-By-Step');
  readonly itemStore = inject(Store<Item>);

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
    console.log("sth");
    this.itemStore.dispatch({ type: 'Add Item', item: { id: '1', name: 'Item 1' } });
  }


}
