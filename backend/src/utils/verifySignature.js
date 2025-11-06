const crypto = require("crypto");

module.exports = (orderId, paymentId, signature, secret) => {
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
};
