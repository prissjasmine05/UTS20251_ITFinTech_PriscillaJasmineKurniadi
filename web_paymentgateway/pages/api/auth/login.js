import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { sendMFACode } from '../../../lib/whatsapp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    // Cari user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Generate MFA code (6 digit)
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    const mfaCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    // Simpan MFA code ke database
    user.mfaCode = mfaCode;
    user.mfaCodeExpiry = mfaCodeExpiry;
    await user.save();

    // Kirim kode via WhatsApp
    const waResult = await sendMFACode(user.phone, mfaCode);
    
    if (!waResult.success) {
      console.error('Failed to send WhatsApp:', waResult.error);
      // Tetap lanjut meski WA gagal (untuk development)
    }

    return res.status(200).json({
      success: true,
      message: 'Kode verifikasi telah dikirim ke WhatsApp Anda',
      userId: user._id,
      requiresMFA: true,
      // HANYA UNTUK DEVELOPMENT - hapus di production
      debugCode: process.env.NODE_ENV === 'development' ? mfaCode : undefined,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}