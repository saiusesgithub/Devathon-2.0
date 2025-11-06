require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const paymentRoutes = require("./src/routes/paymentRoutes.js");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(bodyParser.json());

// main payment routes
app.use("/api/payments", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Backend running at http://localhost:" + process.env.PORT);
});
