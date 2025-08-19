import { useState, useMemo } from "react";
import type { Product } from '../interface/interface';
import { useDispatch } from "react-redux";
import { addProduct, removeProduct, decreaseProduct } from "../store/cartSlice";
const categories = ["All", "Beverages", "Lunch", "Snacks"];

type ProductCatalogProps = {
  products : Product[]
}

const ProductCatalog : React.FC<ProductCatalogProps> = ({products}) => {
  const dispatch = useDispatch();
  // State for filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Filtering & searching
  const filtered = useMemo(() => {
    let filteredProducts = products;
    if (category !== "All") {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
      );
    }
    return filteredProducts;
  }, [products, search, category]);

  return (
    <div>
      <h2>Product Catalog</h2>
      <input
        placeholder="Search by name or sku"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <ul>
        {filtered.map(product => (
          <li key={product.id}>
            <strong>{product.name}- ₹{product.price} ({product.category})</strong>
            <button onClick={() => dispatch(addProduct({prod: product}))}>+</button> 
            <button onClick={() => dispatch(decreaseProduct(product.id))}>-</button> 
            <button onClick={() => dispatch(removeProduct(product.id))}>Remove</button> 
          </li>
        ))}
        {filtered.length === 0 && <li>No products found.</li>}
      </ul>
    </div>
  );
};

export default ProductCatalog;
