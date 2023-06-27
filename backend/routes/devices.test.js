const app = require("../index");
const supertest = require("supertest");

const request = supertest(app);

const user = {
  email: "marydoe@email",
  password: "123456",
  firstName: "Mary",
  lastName: "Doe",
};

const device = {
  name: "Mary's device",
  serialNumber: "1234567a",
  number: "1234567",
  simID: "12",
  imei: "123456789012345",
};

let token;
let deviceId;

beforeAll(async () => {
  const { body } = await request.post("/register").send(user);
  token = body.token;
});

it("Add a device", async () => {
  const response = await request
    .post("/devices/")
    .send(device)
    .set("Authorization", `Bearer ${token}`);
  deviceId = response.body.device.id;
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("device");
});

it("Get one device", async () => {
  const response = await request
    .get(`/devices/${deviceId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("device");
});

it("Get all devices", async () => {
  const response = await request
    .get("/devices")
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("devices");
});

it("Update device", async () => {
  const response = await request
    .put(`/devices/${deviceId}`)
    .send({ simID: "13" })
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("device");
});

it("Create cooking percentages", async () => {
  const response = await request
    .post(`/devices/${deviceId}/cooking-percentages`)
    .send({
      startDate: new Date(),
      fullLoad: 50,
      twoThirdsLoad: 30,
      halfLoad: 20,
    })
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("data");
});

it("Get cooking percentages", async () => {
  const response = await request
    .get(`/devices/${deviceId}/cooking-percentages`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body.device).toHaveProperty("monthlyCookingPercentages");
});

it("Delete device", async () => {
  const response = await request
    .delete(`/devices/${deviceId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("device");
});

it("Fail to get devices without token", async () => {
  const response = await request.get("/devices");
  expect(response.status).toBe(403);
});
