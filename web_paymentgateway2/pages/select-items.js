// http://localhost:3000/select-items
export default function SelectItemsPage({ products }) {
    return (
      <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>Pilih Produk</h1>
        {products.length === 0 ? (
          <p>Tidak ada produk yang tersedia.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {products.map((product) => (
              <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>{product.name}</h2>
                <p>Kategori: {product.category}</p>
                <p>{product.description}</p>
                <h3>Rp {product.price.toLocaleString('id-ID')}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export async function getServerSideProps() {
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const { data } = await res.json();
  
      return {
        props: {
          products: data, 
        },
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return {
        props: {
          products: [], 
        },
      };
    }
  }