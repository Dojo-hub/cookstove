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

const device = {
  name: "Jd's device",
  serialNumber: "1234567b",
  number: "12345678",
  simID: "13",
  imei: "1234567890123456",
};

let token;

beforeAll(async () => {
  const { body } = await request.post("/register").send(user);
  token = body.token;
  await request
    .post("/devices/")
    .send(device)
    .set("Authorization", `Bearer ${token}`);
});

it("Add logs", async () => {
  request.post = jest.fn(request.post);
  await Promise.all(
    logs.map(async (log) => {
      await request
        .post("/logs/json")
        .send(log)
        .set("Authorization", `Bearer ${token}`);
    })
  );
  expect(request.post).toHaveBeenCalledTimes(logs.length);
});

it("Create event", async () => {
  // run python script to create event
  const python = spawn("py", ["../scripts/cooking_events.py", "test"]);
  await new Promise((resolve) => {
    python.stdout.on("data", function (data) {
      console.log("Pipe data from python script ...");
      console.log(data.toString());
    });
    python.stderr.on("data", (data) => {
      console.error("stderr: ", data.toString("utf8"));
    });
    python.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
});

it("Get all events", async () => {
  const { body } = await request
    .get("/events/")
    .set("Authorization", `Bearer ${token}`);
  expect(body.length).toBe(1);
});
