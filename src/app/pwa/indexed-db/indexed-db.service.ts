import { Injectable } from '@angular/core';
import { appConfig } from '../../shared/config/app.config';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  openDatabase(): IDBOpenDBRequest {
    const request = indexedDB.open(
      appConfig.database.name,
      appConfig.database.version
    );

    request.onupgradeneeded = (event) => {
      this.handleUpgrade(event, appConfig.database.stores.tasks, 'id');
    };

    return request;
  }

  handleUpgrade(
    event: IDBVersionChangeEvent,
    storeName: string,
    keyPath: string
  ): void {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath });
    }
  }

  putAll<T>(storeName: string, items: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.openDatabase();
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.writePutAll(db, storeName, items, resolve, reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const request = this.openDatabase();
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.readAll<T>(db, storeName, resolve, reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  deleteRecord(storeName: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.openDatabase();
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.writeDelete(db, storeName, key, resolve, reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  clearStore(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.openDatabase();
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.writeClear(db, storeName, resolve, reject);
      };
      request.onerror = () => reject(request.error);
    });
  }

  private writePutAll<T>(
    db: IDBDatabase,
    storeName: string,
    items: T[],
    resolve: () => void,
    reject: (reason: unknown) => void
  ): void {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    items.forEach((item) => store.put(item));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  }

  private readAll<T>(
    db: IDBDatabase,
    storeName: string,
    resolve: (value: T[]) => void,
    reject: (reason: unknown) => void
  ): void {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = (event) => {
      resolve((event.target as IDBRequest<T[]>).result);
    };
    getAllRequest.onerror = () => reject(getAllRequest.error);
  }

  private writeDelete(
    db: IDBDatabase,
    storeName: string,
    key: string,
    resolve: () => void,
    reject: (reason: unknown) => void
  ): void {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const deleteRequest = store.delete(key);
    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => reject(deleteRequest.error);
  }

  private writeClear(
    db: IDBDatabase,
    storeName: string,
    resolve: () => void,
    reject: (reason: unknown) => void
  ): void {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => resolve();
    clearRequest.onerror = () => reject(clearRequest.error);
  }
}
