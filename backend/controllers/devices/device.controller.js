const {
  Device,
  Device_logs,
  log_files,
  Cooking_Percentages,
} = require("../../models/index");
const httpError = require("../../helpers/httpError");
const { Op } = require("sequelize");
const isValidDate = require("../../helpers/checkdate");

const getAll = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = 50;
    const devices = await Device.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["name", "ASC"],
      ],
      limit,
      offset: page * limit,
    });
    res.send({ devices });
  } catch (error) {
    res.status(500).send();
  }
};

const getLogs = async (req, res) => {
  try {
    const limit = 100;
    const { id } = req.params;
    const { page = 0, startDate, endDate } = req.query;
    const include = {
      model: Device_logs,
      as: "logs",
      limit,
      offset: page * limit,
      order: [["timestamp", "DESC"]],
    };
    if (isValidDate(startDate) && isValidDate(endDate)) {
      include.where = {
        timestamp: {
          [Op.gte]: new Date(startDate),
          [Op.lte]: new Date(endDate),
        },
        temperature: {
          [Op.not]: null,
        },
      };
      delete include.limit;
    }
    if (startDate === "undefined" || endDate === "undefined")
      delete include.limit;
    const device = await Device.findOne({
      where: { id },
      include,
    });
    if (device) {
      const logcount = await device.countLogs();
      res.send({ device, logcount });
    } else res.send({ device: { logs: [] }, logcount: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
    });
    res.send({ device });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const createCookingPercentages = async (req, res) => {
  const { id } = req.params;
  const { fullLoad, twoThirdLoad, oneThirdLoad, startDate } = req.body;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    // Find the row where startDate is less than the new startDate and endDate is greater than the new startDate
    const existingRow = await Cooking_Percentages.findOne({
      where: {
        deviceId: id,
        startDate: {
          [Op.lt]: new Date(startDate),
        },
        endDate: {
          [Op.gt]: new Date(startDate),
        },
      },
      transaction,
    });

    // Update the existing row's endDate if found
    if (existingRow) {
      await existingRow.update(
        {
          endDate: new Date(startDate),
        },
        { transaction }
      );
    }

    // Update the endDate of the last row if needed
    await Cooking_Percentages.update(
      {
        endDate: new Date(startDate),
      },
      {
        where: {
          deviceId: id,
          endDate: {
            [Op.gt]: new Date(startDate),
          },
        },
      },
      { transaction }
    );

    // Create a new row with the provided data
    const newRow = await Cooking_Percentages.create(
      {
        startDate,
        endDate: existingRow ? existingRow.endDate : new Date(253402300000000),
        fullLoad,
        twoThirdLoad,
        oneThirdLoad,
        deviceId: id,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    res.send({ data: newRow });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const getCookingPercentages = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0 } = req.query;
    const limit = 50;
    const include = {
      model: Cooking_Percentages,
      as: "monthlyCookingPercentages",
      limit,
      offset: page * limit,
      order: [["createdAt", "DESC"]],
    };
    const device = await Device.findOne({
      where: { id },
      include,
    });
    if (device) {
      const count = await device.countMonthlyCookingPercentages();
      res.send({ device, count });
    } else res.send({ device: { monthlyCookingPercentages: [] }, count: 0 });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const updateCookingPercentages = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullLoad, twoThirdsLoad, halfLoad } = req.body;
    if (!(fullLoad && twoThirdsLoad && halfLoad))
      throw new httpError("Missing required field!", 400);
    await Cooking_Percentages.update(
      {
        fullLoad,
        twoThirdsLoad,
        halfLoad,
      },
      { where: { id } }
    );
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const addOne = async (req, res) => {
  try {
    const { name, serialNumber, number, simID, imei } = req.body;
    if (!(name && serialNumber && number && simID && imei))
      throw new httpError("Missing required field!", 400);
    const deviceExists = await Device.findOne({ where: { serialNumber } });
    if (deviceExists) throw new httpError("Duplicate serial number", 409);
    const device = await Device.create(req.body);
    await Cooking_Percentages.create({
      deviceId: device.id,
      startDate: new Date(),
      // endDate is '9999-12-31'
      endDate: new Date(253402300000000),
      fullLoad: 60,
      twoThirdsLoad: 20,
      halfLoad: 10,
    });
    res.send({ device });
  } catch (error) {
    if (error.name === "httpError")
      res.status(error.code).send({ message: error.message });
    else {
      console.log(error);
      res.status(500).send();
    }
  }
};

const updateOne = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.update(req.body, { where: { id } });
    res.status(201).send({ device });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.destroy({ where: { id } });
    res.send({ device });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const saveLogFile = async (req, res) => {
  let file;
  if (!req.files) return res.send({ msg: "No file." });
  file = req.files[0];

  try {
    if (!file) {
      throw new Error("No file");
    }
    const device = file.originalname.substring(
      0,
      file.originalname.indexOf(".")
    );
    await log_files.create({
      name: file.filename,
      parsed: false,
      device,
    });
    res.send({ msg: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const saveJsonLog = async (req, res) => {
  try {
    const { imei, timestamp } = req.body;
    if (!imei) throw new httpError("imei is required.", 409);
    const device = await Device.findOne({ where: { imei } });
    if (!device) throw new httpError(`No device exists with imei ${imei}`, 409);
    req.body.timestamp = new Date(timestamp * 1000);
    await device.createLog(req.body);
    res.send({ msg: "Log added successfully" });
  } catch (error) {
    if (error.name === "httpError") res.status(error.code).send(error.message);
    else res.sendStatus(500);
  }
};

module.exports = {
  createCookingPercentages,
  getAll,
  getCookingPercentages,
  getOne,
  getLogs,
  addOne,
  deleteOne,
  updateOne,
  updateCookingPercentages,
  saveJsonLog,
  saveLogFile,
};
