const express =  require("express");
const logger = require("morgan");
const auth = require("./routes/auth");
const devices = require("./routes/devices");
const validateUser = require("./middleware/validatejwt");

const app = express();

const PORT = 3000;

app.use(logger("dev"));

app.use(express.json());

app.use('/', auth);
app.use("/devices", validateUser, devices);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
