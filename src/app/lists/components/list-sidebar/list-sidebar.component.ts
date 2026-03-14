import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list.models';

@Component({
  selector: 'app-list-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2 p-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Lijsten
        </h2>
        <button
          data-testid="create-list-button"
          (click)="createListRequested.emit()"
          class="flex items-center justify-center w-7 h-7 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
          aria-label="Nieuwe lijst aanmaken"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      @if (listService.lists().length === 0) {
        <p
          data-testid="empty-lists"
          class="text-sm text-gray-400 dark:text-gray-500 py-2"
        >
          Nog geen lijsten.
        </p>
      }

      @for (list of listService.lists(); track list.id) {
        <div class="flex items-center gap-1">
          <button
            data-testid="list-item"
            [attr.aria-current]="isActive(list)"
            (click)="listService.setActiveList(list)"
            class="flex-1 flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-lg text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            [class.bg-blue-50]="isActive(list)"
            [class.dark:bg-blue-900]="isActive(list)"
          >
            @if (list.icon) {
              <span aria-hidden="true">{{ list.icon }}</span>
            }
            @if (list.color) {
              <span
                aria-hidden="true"
                class="w-3 h-3 rounded-full flex-shrink-0"
                [style.background-color]="list.color"
              ></span>
            }
            <span>{{ list.name }}</span>
          </button>
          <button
            data-testid="delete-list-button"
            (click)="onDeleteList(list)"
            class="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
            [attr.aria-label]="'Lijst ' + list.name + ' verwijderen'"
          >
            <span aria-hidden="true">&#128465;</span>
          </button>
        </div>
      }
    </div>
  `,
})
export class ListSidebarComponent {
  readonly listService = inject(ListService);
  readonly createListRequested = output<void>();

  isActive(list: List): boolean {
    return this.listService.activeList()?.id === list.id;
  }

  onDeleteList(list: List): void {
    this.listService.deleteList(list.id);
  }
}
