const razorpay = require("../services/razorpay");
const verifySignature = require("../utils/verifySignature");

exports.createOrder = async (req, res) => {
  try {
    const amount = req.body.amount;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "rcpt_" + Math.random(),
    });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const result = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (result) {
    return res.json({ status: "ok" });
  } else {
    return res.status(400).json({ status: "failed" });
  }
};
