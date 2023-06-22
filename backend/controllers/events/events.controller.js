const db = require("../../models/index");
const dotenv = require("dotenv");
const sequelize = require("sequelize");
dotenv.config();

const deviceEvents = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const events = await db.Cooking_Events.findAndCountAll({
      where: {
        deviceId,
      },
    });
    res.status(200).send(events);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const eventLogs = async (req, res) => {
  try {
    const { eventId } = req.params;
    const logs = await db.Device_logs.findAll({
      where: {
        event: eventId,
        // temperature and weight are not null
        [sequelize.Op.and]: [
          { temperature: { [sequelize.Op.ne]: null } },
          { weight: { [sequelize.Op.ne]: null } },
        ],
      },
    });
    res.status(200).send(logs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const eventsData = async (req, res) => {
  try {
    const { deviceId, startDate, endDate } = req.query;
    const where = {
      startDate: {
        [sequelize.Op.gte]: startDate,
      },
      endDate: {
        [sequelize.Op.lte]: endDate,
      },
    };
    if (deviceId) where.deviceId = deviceId;
    const events = await db.Cooking_Events.findOne({
      where,
      attributes: [
        [sequelize.literal("SUM(duration)"), "sumDuration"],
        [sequelize.literal("MAX(maximumTemperature)"), "maxTemperature"],
        [sequelize.literal("SUM(foodMass)"), "sumFoodMass"],
        [sequelize.literal("SUM(totalFuelMass)"), "sumFuelMass"],
        [sequelize.literal("SUM(energyConsumption)"), "sumEnergyConsumption"],
        [sequelize.literal("SUM(usefulEnergy)"), "sumUsefulEnergy"],
        [sequelize.literal("SUM(energySavings)"), "sumEnergySavings"],
        [sequelize.literal("AVG(energyConsumption)"), "avgEnergyConsumption"],
        [sequelize.literal("AVG(usefulEnergy)"), "avgUsefulEnergy"],
        [sequelize.literal("AVG(power)"), "avgPower"],
        [sequelize.literal("AVG(averageTemperature)"), "avgTemperature"],
      ],
    });
    res.status(200).send(events);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

const graphData = async (req, res) => {
  try {
    const { deviceId, startDate, endDate, groupBy } = req.query;
    const format = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";
    const where = {
      startDate: {
        [sequelize.Op.gte]: startDate,
      },
      endDate: {
        [sequelize.Op.lte]: endDate,
      },
    };
    if (deviceId) where.deviceId = deviceId;
    const events = await db.Cooking_Events.findAll({
      where,
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("startDate"), format),
          groupBy,
        ],
        [sequelize.literal("MAX(maximumTemperature)"), "maxTemperature"],
        [sequelize.literal("AVG(duration)"), "avgDuration"],
        [sequelize.literal("AVG(foodMass)"), "avgFoodMass"],
        [sequelize.literal("AVG(totalFuelMass)"), "avgFuelMass"],
        [sequelize.literal("AVG(energyConsumption)"), "avgEnergyConsumption"],
        [sequelize.literal("AVG(usefulEnergy)"), "avgUsefulEnergy"],
        [sequelize.literal("AVG(energySavings)"), "avgEnergySavings"],
        [sequelize.literal("AVG(power)"), "avgPower"],
        [sequelize.literal("AVG(averageTemperature)"), "avgTemperature"],
        [sequelize.literal("SUM(foodMass)"), "sumFoodMass"],
        [sequelize.literal("SUM(totalFuelMass)"), "sumFuelMass"],
        [sequelize.literal("SUM(energyConsumption)"), "sumEnergyConsumption"],
        [sequelize.literal("SUM(usefulEnergy)"), "sumUsefulEnergy"],
        [sequelize.literal("SUM(energySavings)"), "sumEnergySavings"],
        [sequelize.literal("SUM(duration)"), "sumDuration"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("startDate"), format)],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("startDate"), format),
          "ASC",
        ],
      ],
    });
    res.status(200).send(events);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

module.exports = {
  deviceEvents,
  eventsData,
  eventLogs,
  graphData,
};
