const app = require("../src/app");
const request = require("supertest");
const Jumpling = require("../src/models/jumpling.model");
const dbHandlers = require("../test/dbHandler");
const User = require("../src/models/user.model");

describe("jumplings", () => {
  let token;

  beforeAll(async () => {
    await dbHandlers.connect();

    const user = new User({ username: "new-username", password: "password" });
    await user.save();
    token = user.generateJWT();
  });
  afterEach(async () => await dbHandlers.clearDatabase());
  afterAll(async () => await dbHandlers.closeDatabase());
  beforeEach(async () => {
    const jumplings = [
      { name: "Sabrina" },
      { name: "Mathilda" },
      { name: "Brenda" },
    ];

    await Jumpling.create(jumplings);
  });

  describe("GET /jumplings", () => {
    it("should retrieve list of jumplings", async () => {
      const { body } = await request(app).get("/jumplings").expect(200);

      expect(body.length).toEqual(3);
    });
  });

  describe("GET /jumplings/presenter", () => {
    it("should return a random jumpling", async () => {
      const { body } = await request(app)
        .get("/jumplings/presenter")
        .expect(200);

      expect(body.length).toEqual(1);
    });
  });

  describe("GET /jumplings/:name", () => {
    it("should retrieve jumpling with requested name", async () => {
      const jumpling = { name: "Sabrina" };

      const { body } = await request(app)
        .get(`/jumplings/${jumpling.name}`)
        .expect(200);

      expect(body).toMatchObject(jumpling);
    });

    it("should retrieve jumpling with requested name in lowercase", async () => {
      const jumpling = { name: "sabrina" };

      const { body } = await request(app)
        .get(`/jumplings/${jumpling.name}`)
        .expect(200);

      expect(body.name.toLowerCase()).toEqual(jumpling.name);
    });
  });

  describe("POST /jumplings", () => {
    it("should create new jumpling if authorized and fields are valid", async () => {
      const jumpling = { name: "Teresa" };

      const { body } = await request(app)
        .post("/jumplings")
        .set("Cookie", `access_token=${token}`)
        .send(jumpling)
        .expect(201);

      expect(body).toMatchObject(jumpling);
    });

    it("should throw error if not authorized", async () => {
      const jumpling = { name: "Teresa" };

      const response = await request(app).post("/jumplings").send(jumpling);

      expect(response.status).toEqual(500);
    });

    it("should throw error if name is empty", async () => {
      const jumpling = { name: "" };

      const response = await request(app)
        .post("/jumplings")
        .set("Cookie", `access_token=${token}`)
        .send(jumpling);

      expect(response.status).toEqual(400);
    });

    it("should throw error if name is too short", async () => {
      const jumpling = { name: "a" };

      const response = await request(app)
        .post("/jumplings")
        .set("Cookie", `access_token=${token}`)
        .send(jumpling);

      expect(response.status).toEqual(400);
    });
  });

  describe("PUT /jumplings/:id", () => {
    it("should modify specified jumpling if authorized and fields are valid", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = { name: "edited" };

      const { body } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .set("Cookie", `access_token=${token}`)
        .send(modifiedJumplingBody)
        .expect(200);

      expect(body).toMatchObject(modifiedJumplingBody);
    });

    it("should throw error if not authorized", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = { name: "edited" };

      const response = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .send(modifiedJumplingBody);

      expect(response.status).toEqual(500);
    });

    it("should throw error if name is empty", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = { name: "" };

      const { status } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .set("Cookie", `access_token=${token}`)
        .send(modifiedJumplingBody);

      expect(status).toEqual(400);
    });

    it("should throw error if request body is not json", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = "not-json-format";

      const { status } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .set("Cookie", `access_token=${token}`)
        .send(modifiedJumplingBody);

      expect(status).toEqual(400);
    });

    it("should throw error if jumpling does not exist", async () => {
      const nonexistentJumplingId = "603f38c9906c48d354d2a86b";
      const modifiedJumplingBody = { name: "edited jumpling name" };

      const response = await request(app)
        .put(`/jumplings/${nonexistentJumplingId}`)
        .send(modifiedJumplingBody)
        .set("Cookie", `access_token=${token}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Jumpling does not exist");
    });
  });

  describe("DELETE /jumplings/:id", () => {
    it("should delete jumpling if authorized and jumpling exists", async () => {
      const jumpling = await Jumpling.findOne();

      const { status } = await request(app)
        .delete(`/jumplings/${jumpling.id}`)
        .set("Cookie", `access_token=${token}`);

      expect(status).toEqual(200);
    });

    it("should throw error if not authorized", async () => {
      const jumpling = await Jumpling.findOne();

      const { status } = await request(app).delete(`/jumplings/${jumpling.id}`);

      expect(status).toEqual(500);
    });

    it("should throw error if jumpling does not exist", async () => {
      const nonexistentJumplingId = "603f38c9906c48d354d2a86b";

      const response = await request(app)
        .delete(`/jumplings/${nonexistentJumplingId}`)
        .set("Cookie", `access_token=${token}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Jumpling does not exist");
    });
  });
});
