const app = require("../src/app");
const request = require("supertest");

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

  it("should throw error if req.body is not json", async () => {
    const newJumpling = "notjson";

    const response = await request(app).post("/jumplings").send(newJumpling);

    expect(response.status).toEqual(400);
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

    expect(response.status).toEqual(400);
  });

  it("should throw error if req.body is not json", async () => {
    const jumplingId = 1;
    const modifiedJumpling = "notjson";

    const response = await request(app)
      .put(`/jumplings/${jumplingId}`)
      .send(modifiedJumpling);

    expect(response.status).toEqual(400);
  });
});

describe("DELETE /jumpling/:id", () => {
  it("should delete jumpling and return deleted jumpling object", async () => {
    const jumplingId = 1;
    const deletedJumpling = { id: 1, name: "New jumpling edited" };

    const response = await request(app).delete(`/jumplings/${jumplingId}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(deletedJumpling);
  });

  it("should throw error if id is invalid", async () => {
    const nonexistentJumplingId = 999;

    const response = await request(app).delete(
      `/jumplings/${nonexistentJumplingId}`
    );

    expect(response.status).toEqual(400);
  });
});
