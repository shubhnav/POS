import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { PrintJobStatus, type PrintJob } from '../interface/interface.ts';
import MinHeap from './PrintPriority/MinHeap.ts';

const sendReceiptToPrinter = async (content:string, dest:string) =>{
    
    try{
        console.log(`Printing to ${dest}: ${content}`);
;    }
    catch(error){
        return error;
    }
}

const MAX_RETRIES = 3;

interface PrinterProps  {
  jobs: MinHeap;
  isPrinting: boolean;
}
const printerInitalState: PrinterProps = {
  jobs: new MinHeap(),
  isPrinting: false
};


// export const printReciept = createAsyncThunk('printer/print', async () => {
//     const response = await sendReceiptToPrinter(content, dest);
//     return response;
// })

// export const persist = createAsyncThunk('printer/print', async ({content,dest},thunkAPI) => {
//     const response = await sendReceiptToPrinter(content, dest);
//     return response;
// })


const printerSlice = createSlice({
  name: 'printer',
  initialState : printerInitalState,
  reducers: {
     addJob(state, action: PayloadAction<{ job: PrintJob}>): void {
        const {job} = action.payload;
        const newJob: PrintJob = {
          ...job,
          status: PrintJobStatus.QUEUED,
          created: Date.now(),
          retries: job.retries ?? 0,
          priority: job.priority ?? 1000
        };
        state.jobs.push(newJob);
        //this.persist();
        //runQueue();
      },

      runQueue(state,action){
        if (state.isPrinting || state.jobs.size() === 0) return;
        state.isPrinting = true;

        while (state.jobs.size() > 0) {
          const job = state.jobs.pop()!;
          if (job.status !== PrintJobStatus.QUEUED) continue;

          try {
            for (const dest of job.destination) {
              console.log("print ", dest, job.content);
            
            }
            job.status = PrintJobStatus.DONE;

          } catch (err) {
            job.retries = (job.retries ?? 0) + 1;
            if (job.retries < MAX_RETRIES) {
              job.status = PrintJobStatus.QUEUED;
              state.jobs.push(job); // retry by re-inserting into heap
              setTimeout(() => runQueue(state,action), Math.pow(2, job.retries!) * 1000);
            } else {
              job.status = PrintJobStatus.FAILED;

            }
          }
          //persist();
        }

        state.isPrinting = false;
      }
    
  }

  ,
  extraReducers: builder => {
    builder
    //   .addCase(printReciept.pending, (state, action) => {
    //     console.log(`Printer ${action.payload.dest} is currently printing ${action.payload.content}`)
    //   })
    //   .addCase(printReciept.fulfilled, (state, action) => {
    //     console.log(`Printer ${action.payload.dest} has printed ${action.payload.content}`)
    //   }).addCase(printReciept.rejected, (state,action)=>{
    //     console.log(`Printer ${action.payload.dest} has failed printing ${action.payload.content}`)
     
    //   })

  }
});

export const {addJob} = printerSlice.actions;
export default printerSlice.reducer;

