const app = require("../index");
const supertest = require("supertest");
const { spawn } = require("child_process");
const os = require("os");
const logs = require("../helpers/testlogs");

const request = supertest(app);

const user = {
  email: "jd@email",
  password: "123456",
  firstName: "John",
  lastName: "Doe",
};

let device = {
  name: "Jd's device",
  serialNumber: "1234567b",
  number: "12345678",
  simID: "13",
  imei: "1234567890123456",
  maximumCookingLoad: 11,
  baselineEfficiency: 80,
  stoveEfficiency: 50,
};

let token;

beforeAll(async () => {
  const { body } = await request.post("/register").send(user);
  token = body.token;
  const { body: b } = await request
    .post("/devices/")
    .send(device)
    .set("Authorization", `Bearer ${token}`);
  device = b.device;
});

it("Add logs", async () => {
  let responses = await Promise.all(
    logs.map((log) =>
      request
        .post("/logs/json")
        .send(log)
        .set("Authorization", `Bearer ${token}`)
    )
  );
  responses = responses.map(({ status }) => status);
  expect(responses).toEqual(expect.not.arrayContaining([409, 500]));
});

it("Create event", async () => {
  const pythonCommand = os.platform() === "win32" ? "py" : "python3";
  const python = spawn(pythonCommand, ["../scripts/cooking_events.py", "test"]);
  const log = await new Promise((resolve, reject) => {
    python.stdout.on("data", async function (data) {
      console.log("Pipe data from python script ...");
      console.log(data.toString());
      const { body, status } = await request
        .get(`/events/${device.id}`)
        .set("Authorization", `Bearer ${token}`);
      if (status !== 200) {
        reject(`Error getting event. Response status: ${status}`);
      } else {
        resolve(body.rows[0]);
      }
    });
    python.stderr.on("data", (data) => {
      reject(`stderr: ${data.toString("utf8")}`);
    });
    python.on("close", (code) => {
      reject(`child process exited with code ${code}`);
    });
  });

  expect(log.duration).toBe(420);
  expect(log.totalFuelMass * 1).toBeCloseTo(0.04, 2);
  expect(log.averageTemperature * 1).toBeCloseTo(139.9, 2);
  expect(log.maximumTemperature * 1).toBeCloseTo(168.63, 2);
  expect(log.energyConsumption * 1).toBeCloseTo(0.18, 2);
  expect(log.power * 1).toBeCloseTo(1.52, 2);
  expect(log.usefulEnergy * 1).toBeCloseTo(0.09, 2);
  expect(log.usefulThermalPower * 1).toBeCloseTo(0.76, 2);
  expect(log.energySavings * 1).toBeCloseTo(0.04, 2);
});

it("Update event on device update", async () => {
  await request
    .put(`/devices/${device.id}`)
    .send({ baselineEfficiency: 90, stoveEfficiency: 60 })
    .set("Authorization", `Bearer ${token}`);
  const { body } = await request
    .get(`/events/${device.id}`)
    .set("Authorization", `Bearer ${token}`);
  const event = body.rows[0];
  expect(event.usefulEnergy * 1).toBeCloseTo(0.11, 2);
  expect(event.usefulThermalPower * 1).toBeCloseTo(0.91, 2);
  expect(event.energySavings * 1).toBeCloseTo(0.02, 2);
});
