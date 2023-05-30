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

const addOne = async (req, res) => {
  try {
    const { name, serialNumber, number, simID, imei } = req.body;
    if (!(name && serialNumber && number && simID && imei))
      throw new httpError("Missing required field!", 400);
    const deviceExists = await Device.findOne({ where: { serialNumber } });
    if (deviceExists) throw new httpError("Duplicate serial number", 409);
    const device = await Device.create(req.body);
    // add first month cooking percentages
    const date = new Date();
    const startDate = date;
    const endDate = new Date(date.setDate(date.getDate() + 30));
    await Cooking_Percentages.create({
      deviceId: device.id,
      month: "Month 1",
      startDate,
      endDate,
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
    res.send({ msg: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    if (error.name === "httpError") res.status(error.code).send(error.message);
    else res.sendStatus(500);
  }
};

module.exports = {
  getAll,
  getOne,
  getLogs,
  addOne,
  deleteOne,
  updateOne,
  saveJsonLog,
  saveLogFile,
};
