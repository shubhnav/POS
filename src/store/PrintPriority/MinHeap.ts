import type { PrintJob} from '../../interface/interface.ts'

/**
 * A MinHeap class for PrintJobs based on priority, then creation time
 */
class MinHeap {
    private heap: PrintJob[] = [];
  
    private compare(a: PrintJob, b: PrintJob): boolean {
      if ((a.priority ?? 1000) === (b.priority ?? 1000)) {
        return (a.created ?? 0) < (b.created ?? 0);
      }
      return (a.priority ?? 1000) < (b.priority ?? 1000);
    }
  
    push(job: PrintJob) {
      this.heap.push(job);
      this.bubbleUp();
    }
  
    pop(): PrintJob | undefined {
      if (this.heap.length === 0) return undefined;
      const root = this.heap[0];
      const end = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this.bubbleDown();
      }
      return root;
    }
  
    peek(): PrintJob | undefined {
      return this.heap[0];
    }
  
    size(): number {
      return this.heap.length;
    }
  
    private bubbleUp() {
      let index = this.heap.length - 1;
      while (index > 0) {
        const parentIdx = Math.floor((index - 1) / 2);
        if (!this.compare(this.heap[index], this.heap[parentIdx])) break;
        [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
        index = parentIdx;
      }
    }
  
    private bubbleDown() {
      let index = 0;
      const length = this.heap.length;
      while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let smallest = index;
  
        if (left < length && this.compare(this.heap[left], this.heap[smallest])) {
          smallest = left;
        }
        if (right < length && this.compare(this.heap[right], this.heap[smallest])) {
          smallest = right;
        }
        if (smallest === index) break;
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      }
    }
  }

  export default MinHeap;