// app/api/products/route.js
import connectMongo from '../../../lib/mongodb';
import Product from '../../../models/Product';

export async function POST(req) {
  await connectMongo();

  const { name, price, category } = await req.json(); 

  try {
    const newProduct = new Product({
      name,
      price,
      category,
    });

    await newProduct.save();
    return new Response(JSON.stringify({ message: 'Product added successfully', newProduct }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error adding product', error }), { status: 500 });
  }
}
