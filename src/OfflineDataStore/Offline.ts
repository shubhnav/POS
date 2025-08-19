
 
  
  interface PendingOperation<T> {
    type: string;
    data: T;
    op: 'put' | 'delete';
  }
  
  import type { DBStores } from "../interface/interface";

  
  export class OfflineDataStore  {
    private db: IDBDatabase | null = null;
    private queue: PendingOperation<any>[] = [];
    private isOnline: boolean;
  
    constructor(private dbName: string) {
 
      this.isOnline = navigator.onLine;
      this.initDB(this.dbName);
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.sync();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  
    private async initDB(dbName: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('orders')) {
            db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          }
        };
        req.onsuccess = () => {
          this.db = req.result;
          resolve();
        };
        req.onerror = () => reject(req.error);
      });
    }

    async deleteDB(name:string){
        if (!this.db) throw new Error('Database not initialized');
        this.db.deleteObjectStore(name)
    }
  
    async write<T>(type: DBStores, data: T): Promise<IDBValidKey> {
      if (!this.db) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const tx = this.db!.transaction([type], 'readwrite');
        const store = tx.objectStore(type);
        const request = store.put(data as any);
  
        request.onsuccess = () => {
          if (!this.isOnline) {
            this.queue.push({ type, data, op: 'put' });
          }
         
          resolve(request.result);
        };
  
        request.onerror = () => reject(request.error);
      });
    }
  
    async read<T>(type: DBStores, id: number): Promise<T | undefined> {
      if (!this.db) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const tx = this.db!.transaction([type], 'readonly');
        const store = tx.objectStore(type);
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
      });
    }
  
    private async sync(): Promise<void> {
      if (!this.isOnline || !this.queue.length) return;
  
      for (let i = 0; i < this.queue.length; i++) {
        try {
          // Example: server sync logic
          await sendToServer(this.queue[i]);
          this.queue.splice(i, 1);
          i--;
        } catch (err) {
          setTimeout(() => this.sync(), Math.min(30000, 2 ** i * 1000));
          break;
        }
      }
 
    }
  }
  
  // Mock server push for demo
  async function sendToServer(data: any): Promise<void> {
    console.log('Sync to server:', data);
  }
  