// app/api/payments/route.js
import connectMongo from '../../../lib/mongodb';
import Payment from '../../../models/Payment';

export async function POST(req) {
  await connectMongo();

  const { user, amount } = await req.json(); 

  try {
    const payment = new Payment({
      user,
      amount,
    });

    await payment.save();
    return new Response(JSON.stringify({ message: 'Payment created successfully', payment }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error creating payment', error }), { status: 500 });
  }
}
