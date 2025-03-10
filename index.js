const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require('./Route/route')

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to our chat app APIs.");
});

app.use("/api/v1", userRoute);


const port = process.env.PORT || 3000;
const uri = "mongodb+srv://afanjaved0122:c0SifUQK3xe933dj@cluster0.ltkki.mongodb.net/examReady";

app.listen(port, () => {
  console.log(`Server Running On Port: ${port}`);
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
  });
