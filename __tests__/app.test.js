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
