const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

const nate = {
  username: "nate",
  password: "1234",
};

const ana = {
  username: "ana",
  password: "1234",
};

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

describe("Testing API Endpoints", () => {
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db("users").truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("Test [POST] /register", () => {
    it("Responds 201 on successful user creation", async () => {
      const res = await request(server).post("/api/auth/register").send(nate);
      expect(res.status).toBe(201);
    });
    it("Responds with new user data", async () => {
      const res = await request(server).post("/api/auth/register").send(ana);
      expect(res.body.username).toBe(ana.username);
    });
  });

  describe("Test [POST] /login", () => {
    it("Responds with 200 on successful login", async () => {
      await request(server).post("/api/auth/register").send(nate);
      const res = await request(server).post("/api/auth/login").send(nate);
      expect(res.status).toBe(200);
    });
    it("Successful login response includes message", async () => {
      await request(server).post("/api/auth/register").send(ana);
      const res = await request(server).post("/api/auth/login").send(ana);
      expect(res.body.message).toContain("Welcome Back");
    });
  });

  describe("Test [GET] /jokes", () => {
    it("Recieve 200 on successful response", async () => {
      await request(server).post("/api/auth/register").send(nate);
      let res = await request(server).post("/api/auth/login").send(nate);
      const userToken = res.body.token;
      res = await request(server)
        .get("/api/jokes")
        .set({ Authorization: userToken });
      expect(res.status).toBe(200);
    });
    it("Receive 401 with invalid token", async () => {
      const userToken = 123;
      const res = await request(server)
        .get("/api/jokes")
        .set({ Authorization: userToken });
      expect(res.status).toBe(401);
    });
  });
});
