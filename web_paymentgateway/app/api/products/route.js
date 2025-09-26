// app/api/products/route.js
import connectMongo from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function GET() {
  await connectMongo();
  
  console.log("Fetching products...");

  try {
    const products = await Product.find();  // Mengambil produk dari MongoDB
    console.log("Fetched products:", products);
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response('Error fetching products', { status: 500 });
  }
}

export async function POST(req) {
  await connectMongo();

  const { name, price, category, description } = await req.json();
  console.log("Adding product:", { name, price, category, description });

  try {
    const newProduct = new Product({
      name,
      price,
      category,
      description,
    });

    await newProduct.save();
    console.log("Product added successfully:", newProduct);
    return new Response(JSON.stringify({ message: 'Product added successfully', newProduct }), { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return new Response('Error adding product', { status: 500 });
  }
}
