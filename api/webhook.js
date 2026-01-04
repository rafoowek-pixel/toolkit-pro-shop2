const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    // Wyślij dane do Google Sheets
    try {
      const orderData = {
        data: new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }),
        imie: metadata.name,
        email: metadata.email,
        telefon: metadata.phone,
        adres: metadata.fullAddress,
        kurier: metadata.courier,
        paczkomat: metadata.paczkomat,
        kwota: (session.amount_total / 100).toFixed(2) + ' zł'
      };

      await fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      console.log('Order saved to Google Sheets:', orderData);
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
    }
  }

  res.status(200).json({ received: true });
}
