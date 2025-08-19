import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { clearCart, setCart } from './store/cartSlice';
import { useDispatch, useSelector} from 'react-redux';
import type { RootState } from './store/store';
import { OfflineDataStore } from './OfflineDataStore/Offline';
import ProductCatalog from './Product/ProductCatalog';
import { addJob } from './store/PrinterSlice';
import { PrintDestination, PrintJobStatus, type Order, type PrintJob } from './interface/interface';

function App() {
  const dispatch = useDispatch();
  const items = useSelector((state:RootState)=> state.order.items);
  const total = useSelector((state:RootState)=> state.order.total);
  const products = [
    { id: 1, name: "Espresso", price: 120, category: "Beverages", sku: "B-001" },
    { id: 2, name: "Cappuccino", price: 150, category: "Beverages", sku: "B-002" },
    { id: 3, name: "Sandwich", price: 220, category: "Lunch", sku: "L-001" },
    { id: 4, name: "Salad", price: 200, category: "Lunch", sku: "L-002" },
    { id: 5, name: "Cookie", price: 50, category: "Snacks", sku: "S-001" },
  ];
  const dbService = new OfflineDataStore('Restaurant');


  const handleReadFromDb = async ()=>{
    const items = await dbService.read('orders',1);
    dispatch(setCart(items.items));
  }

  const handleAddPrint = async () =>{
     const order:Order = {
        id:1,
        items:items.map((d)=> d.prod),
        status : 'pending',
        total: total,
        updatedAt: new Date() };
      
      const printJob: PrintJob = {
        id:1, 
        content: JSON.stringify(order),
        destination: [PrintDestination.BAR,PrintDestination.KITCHEN]
    
      }
      dispatch(addJob({job: printJob}));

  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
  

        <button onClick={() => dispatch(clearCart())}>
          Clear  Cart
        </button>
        <button onClick={() => dbService.write('orders',{items:items})}>
          Check Out
        </button>
        <button onClick={() => handleReadFromDb()}>
          Read from DB
        </button>
        <button onClick={() => handleAddPrint()}>
          Print
        </button>

        <button >
          Total: {total}
        </button>
        <br/>
        <strong> Current Cart
        {
         items.map(
          (item)=>

        <p>
          Product {item.prod.name}
          Quantity {item.quantity}
        </p>
       
         )
        }
        </strong>
      </div>
      <ProductCatalog products={products}/>
    </>
  )
}

export default App
