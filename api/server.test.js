const request = require("supertest");
const server = require("./server");

test("sanity", () => {
  expect(true).toBe(true);
});

describe("Server Tests", () => {
  it("Check Environment", () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });
  it("Server responds with 200 status code", async () => {
    const statusCode = 200;
    const res = await request(server).get("/");
    expect(res.status).toBe(statusCode);
  });
  it("Server receives API message", async () => {
    const res = await request(server).get("/");
    expect(res.text).toBe('"Your API is running, better go catch it!"');
  });
});
