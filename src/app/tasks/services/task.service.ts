import { Injectable, signal, effect } from '@angular/core';
import { Task, CreateTaskRequest } from '../models/task.models';
import { appConfig } from '../../shared/config/app.config';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);

  constructor() {
    effect(() => {
      this.persistTasksToIndexedDb(this.tasks());
    });
  }

  createTask(request: CreateTaskRequest): void {
    const newTask = this.buildTask(request);
    this.tasks.update((current) => [...current, newTask]);
  }

  private buildTask(request: CreateTaskRequest): Task {
    return {
      id: crypto.randomUUID(),
      title: request.title,
      description: request.description,
      deadline: request.deadline,
      priority: request.priority,
      isCompleted: false,
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
      listId: null,
    };
  }

  private persistTasksToIndexedDb(tasks: Task[]): void {
    const request = indexedDB.open(appConfig.database.name, appConfig.database.version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(appConfig.database.stores.tasks)) {
        db.createObjectStore(appConfig.database.stores.tasks, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.writeTasksToStore(db, tasks);
    };
  }

  private writeTasksToStore(db: IDBDatabase, tasks: Task[]): void {
    const transaction = db.transaction(appConfig.database.stores.tasks, 'readwrite');
    const store = transaction.objectStore(appConfig.database.stores.tasks);
    tasks.forEach((task) => store.put(task));
  }
}
