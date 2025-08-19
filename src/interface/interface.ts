export type DBStores = 'orders' | 'products';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    sku: string;
  }

export interface CartItem {
    prod: Product;
    quantity: number;
    customizations?: Record<string, any>;
  }
 
export interface Order {
    id: number;
    items: Product[];
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'completed';
    updatedAt: Date;
  }

  export interface CartState {
    items: CartItem[];
    total: number;
  }
export enum PrintDestination {
    RECEIPT = 'receipt',
    KITCHEN = 'kitchen',
    BAR = 'bar',
};
  
export enum PrintJobStatus {
    QUEUED = 'queued',
    DONE = 'done',
    FAILED = 'failed',
}
  
export interface PrintJob {
    id?: number;
    content: string;
    destination: PrintDestination[];
    status?: PrintJobStatus;
    created?: number;
    retries?: number;
    priority?: number; // Lower number = higher priority
  }