const express = require("express");
const fs = require("fs");
const logger = require("morgan");
const auth = require("./routes/auth");
const devices = require("./routes/devices");
const users = require("./routes/users");
const logs = require("./routes/logs");
const stats = require("./routes/stats");
const validateUser = require("./middleware/validatejwt");
const cors = require("cors")({
  origin: "*",
});
const cron = require("node-cron");
const { Device, log_files, sequelize } = require("./models/index");
const csvtojson = require("./helpers/csvtojson");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(cors);

logger.token("date", () =>
  new Date().toLocaleString({ timeZone: "East Africa Time" })
);

app.use(logger("common"));

app.use(express.json());
app.use(express.text());

app.use("/", auth);
app.use("/devices", validateUser, devices);
app.use("/logs", logs);
app.use("/admin/users", validateUser, users);
app.use("/stats", validateUser, stats);

if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

cron.schedule("* * * * *", async () => {
  try {
    const files = await log_files.findAll({
      where: { parsed: false },
    });
    for (let file of files) {
      const filepath = `${__dirname}/uploads/logs/${file.name}`;
      const device = await Device.findOne({ where: { imei: file.device } });
      await sequelize.transaction(async (transaction) => {
        if (fs.existsSync(filepath) && device) {
          const data = await csvtojson(filepath);
          for (const log of data) {
            const exists = await device.getLogs({
              where: { timestamp: log.timestamp },
            });
            if (exists.length === 0)
              await device.createLog(log, { transaction });
          }
          await log_files.update(
            { parsed: true },
            { where: { name: file.name }, transaction }
          );
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
