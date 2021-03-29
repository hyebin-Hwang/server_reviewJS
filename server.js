const express = require("express");
const app = express();
const router = require("./routes/main")(app);

app.listen(3500, () => console.log("server 3500port!"));
