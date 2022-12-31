const { Device, Device_logs } = require("../../models/index");
const httpError = require("../../helpers/httpError");

const SALTROUNDS = 10;

const getAll = async (req, res) => {
  try {
    const devices = await Device.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["name", "ASC"],
      ],
    });
    res.send({ devices });
  } catch (error) {
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

const createLog = async (req, res) => {
  try {
    const imei = req.body.imei;
    if(!imei){
      throw new httpError("IMEI is required", 400);
    }
    const device = await Device.findOne({ where: { imei } });
    if(!device)throw new httpError("Device does not exist!", 400);
    const log = await device.createDevice_log(req.body);
    res.send({ log });
  } catch (error) {
    if (error.name === "httpError") res.status(error.code).send(error.message);
    else res.status(500).send();
  }
};

module.exports = { getAll, getOne, addOne, deleteOne, updateOne, createLog };
