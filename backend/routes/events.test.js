const app = require("../index");
const supertest = require("supertest");
const { spawn } = require("child_process");
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
  request.post = jest.fn(request.post);
  try {
    await Promise.all(
      logs.map(async (log) => {
        await request
          .post("/logs/json")
          .send(log)
          .set("Authorization", `Bearer ${token}`);
      })
    );
    expect(request.post).toHaveBeenCalledTimes(logs.length);
  } catch (error) {
    console.log(error);
  }
});

it("Create event", async () => {
  const python = spawn("py", ["../scripts/cooking_events.py", "test"]);
  try {
    const log = await new Promise((resolve, reject) => {
      python.stdout.on("data", async function (data) {
        console.log("Pipe data from python script ...");
        console.log(data.toString());
        const { body, status } = await request
          .get(`/events/${device.id}`)
          .set("Authorization", `Bearer ${token}`);
        if (status !== 200) {
          reject(`Error getting event. REsponse status: ${status}`);
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
  } catch (error) {
    console.log(error);
  }
});
