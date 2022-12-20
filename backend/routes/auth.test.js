const app = require("../index");
const supertest = require("supertest");

const request = supertest(app);

const user = {
  email: "johndoe@email",
  password: "123456",
  firstName: "John",
  lastName: "Doe",
};

let token;

it("Registers new user", async () => {
  const response = await request.post("/register").send(user);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
});

it("Fail to register if user email exists", async () => {
  const response = await request.post("/register").send(user);
  expect(response.status).toBe(400);
  expect(response.body.message).toBe("User with same email already exists!");
});

it("Login user", async () => {
  const response = await request.post("/login").send(user);
  token = response.body.token;
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
});

it("Change user password", async () => {
  const response = await request
    .put("/change-password")
    .send({ ...user, oldPassword: "123456" })
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
});

it("Fail to change user password if old password is wrong", async () => {
  const response = await request
    .put("/change-password")
    .send({ ...user, oldPassword: "12345" })
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(409);
  expect(response.body.message).toBe("Old password is incorrect");
});

it("Get user profile", async () => {
  const response = await request
    .get("/profile")
    .send(user)
    .set("Authorization", `Bearer ${token}`);
  expect(response.status).toBe(200);
});
