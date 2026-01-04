import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { name, email, phone, street, city, zipCode, courier, paczkomat } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Zestaw TOOLKIT PRO',
              description: 'Elastyczny przedłużacz 290mm + 3 adaptery nasadkowe',
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Dostawa - ' + courier,
            },
            unit_amount: 1200,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://toolkit-pro-shop2.vercel.app/?success=true',
      cancel_url: 'https://toolkit-pro-shop2.vercel.app/?canceled=true',
      metadata: {
        name,
        email,
        phone,
        street,
        city,
        zipCode,
        courier,
        paczkomat: paczkomat || 'Nie dotyczy',
        fullAddress: `${street}, ${zipCode} ${city}`
      },
      customer_email: email,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
