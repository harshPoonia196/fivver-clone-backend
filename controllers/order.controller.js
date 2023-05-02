import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

export const intent = async (req, res, next) => {
  const { id: buyerId } = req.params;
  const stripe = new Stripe(process.env.STRIPE);

  const gig = await Gig.findById(req.params.id);
  const price = gig.price * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "INR",
    payment_method_types: ["card"],
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const getOrders = async (req, res, next) => {
  const { userId, isSeller } = req.body;
  try {
    const orders = await Order.find({
      ...(isSeller ? { sellerId: userId } : { buyerId: userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
