const app = require("../src/app");
const request = require("supertest");

describe("/jumplings/presenters", () => {
  it("GET should return no presenters if empty", async () => {
    const response = await request(app).get("/jumplings/presenters");

    expect(response.body).toEqual([]);
  });

  it("POST should throw error if no jumplings exist yet", async () => {
    const agent = request(app);
    const { status } = await agent.post("/jumplings/presenters");

    expect(status).toEqual(400);
  });

  it("POST should generate a presenter if jumplings exist", async () => {
    const expectedPresenters = [
      {
        id: 1,
        name: "Alice",
      },
    ];

    const agent = request(app);
    await agent.post("/jumplings").send(expectedPresenters[0]);
    await agent.post("/jumplings/presenters");
    const { body } = await agent.get("/jumplings/presenters");

    expect(body).toMatchObject(expectedPresenters);
  });

  it("GET should return 1 presenter when 1 presenter has been posted", async () => {
    const agent = request(app);
    const { body } = await agent.get("/jumplings/presenters");

    expect(body.length).toEqual(1);
  });
});
