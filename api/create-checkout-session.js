import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "ron",
              product_data: { name: "Donație Tarot" },
              unit_amount: 200, // exemplu 5 RON
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      return res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Eroare la Stripe:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
