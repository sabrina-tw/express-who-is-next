const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user.model");
const dbHandlers = require("../test/dbHandler");

describe("users", () => {
  beforeAll(async () => await dbHandlers.connect());
  afterEach(async () => await dbHandlers.clearDatabase());
  afterAll(async () => await dbHandlers.closeDatabase());
  beforeEach(async () => {
    const users = [{ username: "username", password: "password" }];

    await User.create(users);
  });

  describe("POST /users", () => {
    it("should add a new user", async () => {
      const expectedUser = {
        username: "new-username",
        password: "password",
      };
      const { body: user } = await request(app)
        .post("/users")
        .send(expectedUser)
        .expect(201);

      expect(user.password).not.toBe(expectedUser.password);
    });

    it("should not add a new user when fields are invalid", async () => {
      const expectedUser = {
        username: "a",
        password: "password",
      };
      const { body } = await request(app)
        .post("/users")
        .send(expectedUser)
        .expect(400);

      expect(body.message).toContain("User validation failed");
    });
  });

  describe("POST /users/login", () => {
    it("should log user in when password is correct", async () => {
      const user = {
        username: "username",
        password: "password",
      };
      const { text } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(200);

      expect(text).toEqual("You are now logged in!");
    });

    it("should not log user in when password is incorrect", async () => {
      const user = {
        username: "username",
        password: "wrongpassword",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(400);
      expect(body).toEqual({ message: "Login failed" });
    });
  });
});
