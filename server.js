const express = require("express");
const app = express();
const cors = require("cors");
const router = require("../routes/main")(app);

app.use(cors());
