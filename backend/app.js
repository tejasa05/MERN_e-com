require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.js");

const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected ");
  });

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// my routes
app.use("/api", authRoutes);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
