import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: login, 2: MFA
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUserId(data.userId);
      setStep(2);
      alert('Kode verifikasi telah dikirim ke WhatsApp Anda');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code: formData.mfaCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login berhasil!');
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {step === 1 ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600 mb-6">Masuk ke akun Anda</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Password"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifikasi MFA</h1>
            <p className="text-gray-600 mb-6">
              Masukkan kode 6 digit yang dikirim ke WhatsApp Anda
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Verifikasi
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.mfaCode}
                  onChange={(e) => setFormData({ ...formData, mfaCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <button
                onClick={handleVerifyMFA}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                {loading ? 'Verifying...' : 'Verifikasi'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Kembali
              </button>
            </div>
          </>
        )}

        <p className="text-center text-gray-600 mt-6">
          Belum punya akun?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-purple-600 hover:underline font-medium"
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
}