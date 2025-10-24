import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: 'User ID dan kode harus diisi' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Cek kode expired
    if (new Date() > user.mfaCodeExpiry) {
      return res.status(400).json({ message: 'Kode verifikasi telah kadaluarsa' });
    }

    // Cek kode valid
    if (user.mfaCode !== code) {
      return res.status(400).json({ message: 'Kode verifikasi salah' });
    }

    // Clear MFA code
    user.mfaCode = undefined;
    user.mfaCodeExpiry = undefined;
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error('MFA verify error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}