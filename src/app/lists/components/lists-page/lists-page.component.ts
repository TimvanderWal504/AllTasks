import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ListSidebarComponent } from '../list-sidebar/list-sidebar.component';
import { ListFormDialogComponent } from '../list-form-dialog/list-form-dialog.component';

@Component({
  selector: 'app-lists-page',
  standalone: true,
  imports: [ListSidebarComponent, ListFormDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full">
      <aside class="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <app-list-sidebar (createListRequested)="openCreateDialog()" />
      </aside>

      <main class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
        <p>Selecteer een lijst om taken te bekijken.</p>
      </main>
    </div>

    @if (isDialogOpen) {
      <app-list-form-dialog (closed)="closeDialog()" />
    }
  `,
})
export class ListsPageComponent {
  isDialogOpen = false;

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }
}
