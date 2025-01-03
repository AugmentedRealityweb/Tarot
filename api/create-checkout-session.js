import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Inițializezi Stripe cu cheia secretă 
      // (asigură-te că ai STRIPE_SECRET_KEY în Environment Variables pe Vercel)
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "ron",
              product_data: {
                name: "Donație Tarot",
              },
              unit_amount: 200, // 5 RON (500 bani)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success`,  // URL pentru succes
        cancel_url: `${req.headers.origin}/cancel`,    // URL pentru anulare
      });

      // Returnezi ID-ul sesiunii
      return res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Eroare la crearea sesiunii Stripe:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Metodă nepermisă
    return res.status(405).json({ error: "Method not allowed" });
  }
}
