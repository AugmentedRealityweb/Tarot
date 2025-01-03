const express = require("express");
const cors = require("cors");
const stripe = require("stripe");

// Initializează Stripe cu cheia secretă din variabilele de mediu
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint pentru creare sesiune de plată
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: {
              name: "Donație Tarot",
            },
            unit_amount: 200, // 5 RON (în bani - 500 bani = 5 RON)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rulează serverul
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));