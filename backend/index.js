const express = require("express");
const logger = require("morgan");
const auth = require("./routes/auth");
const devices = require("./routes/devices");
const validateUser = require("./middleware/validatejwt");
const cors = require("cors")({
  origin: "*",
});

const app = express();

const PORT = 3000;

app.use(cors);

app.use(logger("dev"));

app.use(express.json());

app.use("/", auth);
app.use("/devices", validateUser, devices);

if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

module.exports = app;
