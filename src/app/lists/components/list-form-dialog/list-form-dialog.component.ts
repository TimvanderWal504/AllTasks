import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.models';

@Component({
  selector: 'app-list-form-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="existingList ? 'Lijst hernoemen' : 'Nieuwe lijst aanmaken'"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
    >
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {{ existingList ? 'Lijst hernoemen' : 'Nieuwe lijst aanmaken' }}
        </h2>

        <form (ngSubmit)="onSubmit()">
          <label
            for="list-name"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Naam
          </label>
          <input
            id="list-name"
            data-testid="list-name-input"
            type="text"
            [value]="nameValue()"
            (input)="onNameInput($event)"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Naam van de lijst"
            autocomplete="off"
          />

          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              data-testid="cancel-button"
              (click)="closed.emit()"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Annuleren
            </button>
            <button
              type="submit"
              data-testid="save-list-button"
              [disabled]="!hasValidName()"
              class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ListFormDialogComponent implements OnInit {
  private readonly listService = inject(ListService);

  existingList: List | null = null;
  readonly closed = output<void>();

  protected readonly nameValue = signal('');

  ngOnInit(): void {
    if (this.existingList) {
      this.nameValue.set(this.existingList.name);
    }
  }

  protected onNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameValue.set(value);
  }

  protected hasValidName(): boolean {
    return this.nameValue().trim().length > 0;
  }

  protected onSubmit(): void {
    if (!this.hasValidName()) {
      return;
    }
    this.saveList();
    this.closed.emit();
  }

  private saveList(): void {
    const name = this.nameValue().trim();
    if (this.existingList) {
      this.listService.renameList(this.existingList.id, { name });
    } else {
      this.listService.createList({ name });
    }
  }
}
