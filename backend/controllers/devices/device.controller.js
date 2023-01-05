const { Device, Device_logs, log_files } = require("../../models/index");
const httpError = require("../../helpers/httpError");

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
    const page = req.query.page || 0;
    const limit = 50;
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: {
        model: Device_logs,
        as: "logs",
        limit,
        offset: page * limit,
      },
    });
    const logcount = await device.countLogs();
    res.send({ device, logcount });
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
    const payload = { ...req.body, userId: req.user.id };
    const device = await Device.create(payload);
    res.send({ device });
  } catch (error) {
    if (error.name === "httpError") res.status(error.code).send(error.message);
    else res.status(500).send();
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
    res.status(500).send();
  }
};

const saveLogFile = async (req, res) => {
  const file = req.files[0];

  try {
    if (!file) {
      throw new Error("No file");
    }
    await log_files.create({ name: file.filename, parsed: false });
    res.send({ msg: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getAll,
  getOne,
  getLogs,
  addOne,
  deleteOne,
  updateOne,
  saveLogFile,
};
