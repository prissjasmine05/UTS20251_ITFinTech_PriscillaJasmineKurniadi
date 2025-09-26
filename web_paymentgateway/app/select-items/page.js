// app/select-items/page.js
'use client'; // Menandakan bahwa ini adalah Client Component

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SelectItems() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('/api/products')
      .then((response) => {
        setProducts(response.data); // Menyimpan produk ke state
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <h1>Select Products</h1>
      <div>
        {products.map((product) => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
