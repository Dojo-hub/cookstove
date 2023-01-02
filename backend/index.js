const express = require("express");
const logger = require("morgan");
const auth = require("./routes/auth");
const devices = require("./routes/devices");
const users = require("./routes/users");
const logs = require("./routes/logs");
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
app.use("/logs", validateUser, logs);
app.use("/admin/users", validateUser, users);

if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

module.exports = app;
