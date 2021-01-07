const app = require("../src/app");
const request = require("supertest");

describe("GET /", () => {
  it("should respond with API docs", async () => {
    const response = await request(app).get("/");

    const expectedOutput = {
      0: "GET    /",
      1: "GET    /jumplings",
      2: "POST   /jumplings",
      3: "GET /jumplings/:id",
      4: "PUT /jumplings/:id",
      5: "DELETE /jumplings/:id",
      6: "-----------------------",
      7: "POST   /jumplings/presenters",
      8: "GET    /jumplings/presenters",
    };

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expectedOutput);
  });
});

describe("GET /jumplings", () => {
  it("should retrieve list of jumplings", async () => {
    const response = await request(app).get("/jumplings");

    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /jumplings", () => {
  it("should add new jumpling and return new jumpling object", async () => {
    const newJumpling = { name: "New jumpling" };
    const expectedJumpling = { id: 1, name: "New jumpling" };

    const response = await request(app).post("/jumplings").send(newJumpling);

    expect(response.status).toEqual(201);
    expect(response.body).toEqual(expectedJumpling);
  });
});

describe("PUT /jumplings/:id", () => {
  it("should modify jumpling and return modified jumpling object", async () => {
    const jumplingId = 1;
    const modifiedJumpling = { name: "New jumpling edited" };

    const response = await request(app)
      .put(`/jumplings/${jumplingId}`)
      .send(modifiedJumpling);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(modifiedJumpling);
  });

  it("should throw error if id is invalid", async () => {
    const nonexistentJumplingId = 999;
    const modifiedJumpling = { name: "New jumpling edited" };

    const response = await request(app)
      .put(`/jumplings/${nonexistentJumplingId}`)
      .send(modifiedJumpling);

    expect(response.status).toEqual(500);
  });
});
