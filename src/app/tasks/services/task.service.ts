import { Injectable, signal, effect } from '@angular/core';
import { Task, CreateTaskRequest } from '../models/task.models';

const DB_NAME = 'todo-pwa-db';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

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
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      this.writeTasksToStore(db, tasks);
    };
  }

  private writeTasksToStore(db: IDBDatabase, tasks: Task[]): void {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    tasks.forEach((task) => store.put(task));
  }
}
