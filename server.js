const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.use(express.json());
app.use(cors());

// Endpoint pentru crearea sesiunii Stripe Checkout
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ron",
            product_data: { name: "Access Fee" },
            unit_amount: 200, // 30 RON
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Eroare la crearea sesiunii: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

    // Obține detalii despre sesiunea de plată
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return res.status(200).json({ hasPaid: true });
    } else {
      return res.status(200).json({ hasPaid: false });
    }
  } catch (error) {
    console.error("Eroare la verificarea statusului plății:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
