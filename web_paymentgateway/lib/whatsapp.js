// lib/whatsapp.js
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Format nomor ke E.164 untuk Twilio WhatsApp sandbox/production
function normalizeToE164ID(phone) {
  if (!phone) return '';
  // buang karakter non-digit
  let s = String(phone).replace(/[^\d]/g, '');
  // 08xxxx -> 628xxxx
  if (s.startsWith('0')) s = '62' + s.slice(1);
  // pastikan ada prefix +
  if (!s.startsWith('62')) s = '62' + s; // jaga-jaga kalau user isi "8123..."
  return `whatsapp:+${s}`;
}

/**
 * Kirim pesan WhatsApp teks biasa
 * toPhoneIntl: "62812xxxxxxxx"
 */
export async function sendWhatsAppText(toPhoneIntl, message) {
  const to = toPhoneIntl.startsWith('whatsapp:')
    ? toPhoneIntl
    : normalizeToE164ID(toPhoneIntl);

  const res = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM, // contoh: 'whatsapp:+14155238886'
    to,
    body: message,
  });
  return res;
}

/**
 * Wrapper agar login.js yang memanggil sendMFACode tetap jalan
 */
export async function sendMFACode(toPhoneIntl, codePlain) {
  const text =
    `Kode OTP login kamu: ${codePlain}\n` +
    `Berlaku 5 menit. Jangan bagikan ke siapa pun.`;
  return sendWhatsAppText(toPhoneIntl, text);
}
