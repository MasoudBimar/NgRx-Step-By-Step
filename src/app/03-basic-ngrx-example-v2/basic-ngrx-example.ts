import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { ItemActions } from './item.actions';
import { selectItems, selectItemsCount, selectLastAddedItemName, selectNextId } from './item.reducer';

@Component({
  selector: 'app-basic-ngrx-example',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './basic-ngrx-example.html',
  styleUrl: './basic-ngrx-example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicNgrxExample {
  private readonly store = inject(Store);

  protected readonly items$ = this.store.select(selectItems);
  protected readonly itemsCount$ = this.store.select(selectItemsCount);
  protected readonly lastAddedItemName$ = this.store.select(selectLastAddedItemName);

  protected itemName = '';
  protected itemDesc = '';

  addItem(): void {
    const name = this.itemName.trim();
    const desc = this.itemDesc.trim();

    if (!name) {
      return;
    }

    this.store
      .select(selectNextId)
      .pipe(take(1))
      .subscribe((id) => {
        this.store.dispatch(ItemActions.addItem({ item: { id, name, desc } }));
      });

    this.itemName = '';
  }

  clearItems(): void {
    this.store.dispatch(ItemActions.clearItems());
  }
}
