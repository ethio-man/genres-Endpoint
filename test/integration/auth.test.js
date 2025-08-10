import request from "supertest";
import { User } from "../../model/user.js";
import { Genres } from "../../model/genre.js";

describe("auth middleware", () => {
  let server;

  beforeEach(async () => {
    ({ default: server } = await import("../../index.js"));
  });

  afterEach(async () => {
    await Genres.deleteMany({});
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
    }
    jest.resetModules();
  });

  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if invalid token is provided", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if valid token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
