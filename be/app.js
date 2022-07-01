const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// imporing dotenv and connecting to the config file
require("dotenv").config({ path: "be/config/config.env" });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// importing routes
const user = require("./routes/user-routes");

// routes
app.use("/api/v1", user);

module.exports = app;
