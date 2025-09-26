// Kita butuh mongoose untuk berinteraksi dengan DB
const mongoose = require('mongoose');
// Import model Product kita
const Product = require('./models/Product').default;
// Ambil connection string dari file .env
require('dotenv').config({ path: './.env.local' });

// --- DATA PRODUK YANG AKAN DIMASUKKAN ---
const productsToSeed = [
  {
    name: "Es Kopi Susu",
    price: 22000,
    description: "Perpaduan kopi, susu, dan gula aren.",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1557142046-c704a3adf364"
  },
  {
    name: "Croissant Cokelat",
    price: 25000,
    description: "Pastry renyah dengan isian cokelat lumer.",
    category: "Snacks",
    imageUrl: "https://images.unsplash.com/photo-1598114353086-443bce01c5a1"
  },
  {
    name: "Paket Hemat Siang",
    price: 40000,
    description: "1 Es Kopi Susu + 1 Croissant Cokelat.",
    category: "Bundles",
    imageUrl: "https://images.unsplash.com/photo-1521437497025-86f77f2409f5"
  },
  {
    name: "Matcha Latte",
    price: 28000,
    description: "Bubuk teh hijau Jepang premium dengan susu segar.",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1525803377221-4213da7d79b9"
  }
];

const seedDB = async () => {
  try {
    // 1. Sambungkan ke database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Berhasil terhubung ke MongoDB...');

    // 2. Kosongkan collection products (agar tidak ada data duplikat)
    await Product.deleteMany({});
    console.log('🧹 Collection Product berhasil dikosongkan...');

    // 3. Masukkan data baru
    await Product.insertMany(productsToSeed);
    console.log('🌱 Berhasil memasukkan data produk baru...');

  } catch (err) {
    console.error('❌ Gagal melakukan seeding:', err);
  } finally {
    // 4. Putuskan koneksi
    mongoose.connection.close();
    console.log('🔌 Koneksi ke MongoDB diputus.');
  }
};

// Panggil fungsi untuk menjalankan proses seeding
seedDB();