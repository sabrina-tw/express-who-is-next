const app = require("../src/app");
const request = require("supertest");
const Jumpling = require("../src/models/jumpling.model");
const dbHandlers = require("../test/dbHandler");

describe("jumplings", () => {
  beforeAll(async () => await dbHandlers.connect());
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
      const expectedJumplings = [
        { name: "Sabrina" },
        { name: "Mathilda" },
        { name: "Brenda" },
      ];

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
  });

  describe("POST /jumplings", () => {
    it("should create new jumpling if fields are valid", async () => {
      const jumpling = { name: "Teresa" };

      const { body } = await request(app)
        .post("/jumplings")
        .send(jumpling)
        .expect(201);

      expect(body).toMatchObject(jumpling);
    });

    it("should throw error if name is empty", async () => {
      const jumpling = { name: "" };

      const response = await request(app).post("/jumplings").send(jumpling);

      expect(response.status).toEqual(400);
    });

    it("should throw error if name is too short", async () => {
      const jumpling = { name: "a" };

      const response = await request(app).post("/jumplings").send(jumpling);

      expect(response.status).toEqual(400);
    });
  });

  describe("PUT /jumplings/:id", () => {
    it("should modify specified jumpling is fields are valid", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = { name: "edited" };

      const { body } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .send(modifiedJumplingBody)
        .expect(200);

      expect(body).toMatchObject(modifiedJumplingBody);
    });

    it("should throw error if name is empty", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = { name: "" };

      const { status } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .send(modifiedJumplingBody);

      expect(status).toEqual(400);
    });

    it("should throw error if request body is not json", async () => {
      const jumpling = await Jumpling.findOne();
      const modifiedJumplingBody = "not-json-format";

      const { status } = await request(app)
        .put(`/jumplings/${jumpling.id}`)
        .send(modifiedJumplingBody);

      expect(status).toEqual(400);
    });
  });
});
