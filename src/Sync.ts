export class SyncEngine {
    private lastSync: Record<string, number> = {};
  
    constructor(private dataStore: OfflineDataStore) {
      super();
    }
  
    async syncEntity(entity: DBStores): Promise<void> {
      const updates = await fetch(`/api/${entity}?since=${this.lastSync[entity] || 0}`)
        .then(res => res.json());
  
      mergeLocal(updates, entity);
  
      const localChanges = await this.dataStore.read<any[]>(entity as DBStores, 0); // replace with real change tracking
      for (const item of (localChanges || [])) {
        await pushLocalChangeToServer(item);
      }
  
      this.lastSync[entity] = Date.now();
      
    }
  }
  
  // Mock helpers
  function mergeLocal(data: any[], entity: string) {
    console.log(`Merging ${entity}:`, data);
  }
  async function pushLocalChangeToServer(data: any) {
    console.log('Pushing local change:', data);
  }
  