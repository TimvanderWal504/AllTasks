import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List, CreateListRequest, UpdateListRequest } from '../models/list.models';
import { appConfig } from '../../shared/config/app.config';

@Injectable({ providedIn: 'root' })
export class ListService {
  private readonly httpClient = inject(HttpClient);

  readonly lists = signal<List[]>([]);
  readonly activeList = signal<List | null>(null);

  constructor() {
    effect(() => {
      this.persistListsToIndexedDb(this.lists());
    });
  }

  createList(request: CreateListRequest): void {
    const newList = this.buildList(request);
    this.lists.update((current) => [...current, newList]);
  }

  renameList(id: string, request: UpdateListRequest): void {
    this.lists.update((current) =>
      current.map((list) => (list.id === id ? { ...list, ...request } : list)),
    );
  }

  deleteList(id: string): void {
    this.lists.update((current) => current.filter((list) => list.id !== id));
    this.clearActiveListIfDeleted(id);
  }

  setActiveList(list: List | null): void {
    this.activeList.set(list);
  }

  private clearActiveListIfDeleted(deletedId: string): void {
    if (this.activeList()?.id === deletedId) {
      this.activeList.set(null);
    }
  }

  private buildList(request: CreateListRequest): List {
    return {
      id: crypto.randomUUID(),
      ownerId: '',
      name: request.name,
      color: request.color,
      icon: request.icon,
      createdAt: new Date().toISOString(),
    };
  }

  private persistListsToIndexedDb(lists: List[]): void {
    const request = indexedDB.open(appConfig.database.name, appConfig.database.version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.ensureObjectStores(db);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.writeListsToStore(db, lists);
    };
  }

  private ensureObjectStores(db: IDBDatabase): void {
    if (!db.objectStoreNames.contains(appConfig.database.stores.lists)) {
      db.createObjectStore(appConfig.database.stores.lists, { keyPath: 'id' });
    }
  }

  private writeListsToStore(db: IDBDatabase, lists: List[]): void {
    const transaction = db.transaction(appConfig.database.stores.lists, 'readwrite');
    const store = transaction.objectStore(appConfig.database.stores.lists);
    lists.forEach((list) => store.put(list));
  }
}
