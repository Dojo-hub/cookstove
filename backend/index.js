const express = require("express");
const fs = require("fs");
const logger = require("morgan");
const auth = require("./routes/auth");
const devices = require("./routes/devices");
const users = require("./routes/users");
const logs = require("./routes/logs");
const validateUser = require("./middleware/validatejwt");
const cors = require("cors")({
  origin: "*",
});
const cron = require("node-cron");
const { Device_logs, log_files, sequelize } = require("./models/index");
const csvtojson = require("./helpers/csvtojson");

const app = express();

const PORT = 3000;

app.use(cors);

app.use(logger("dev"));

app.use(express.json());

app.use("/", auth);
app.use("/devices", validateUser, devices);
app.use("/logs", logs);
app.use("/admin/users", validateUser, users);

if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });

// cron.schedule("* * * * *", async () => {
//   const transaction = await sequelize.transaction();
//   try {
//     const fileNames = await log_files.findAll({
//       where: { parsed: false },
//     });
//     const dataArray = [];
//     for (let filename of fileNames) {
//       const filepath = `${__dirname}/uploads/logs/${filename.name}`;
//       if (fs.existsSync(filepath)) {
//         const data = await csvtojson(filepath);
//         console.log(filename.name)
//         dataArray.push(data);
//         await log_files.update(
//           { parsed: true },
//           { where: { name: filename.name }, transaction }
//         );
//       }
//     }
//     await Device_logs.bulkCreate(dataArray, { transaction });

//     await transaction.commit();
//   } catch (error) {
//     await transaction.rollback();
//     console.log(error);
//   }
// });

module.exports = app;
