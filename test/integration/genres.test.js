import request from "supertest";
import mongoose from "mongoose";
import { Genres } from "../../model/genre.js";
import { User } from "../../model/user.js";

let server;
describe("/api/genres", () => {
  const id = new mongoose.Types.ObjectId();
  let token, genre, name;
  beforeEach(async () => {
    ({ default: server } = await import("../../index.js"));
    token = new User().generateAuthToken();
    genre = new Genres({ name: "genre1" });
    await genre.save();
  });

  afterEach(async () => {
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
    }
    await Genres.deleteMany({});
    jest.resetModules();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      genre = new Genres({ name: "genre2" });
      await genre.save();
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    let genres;
    it("should return a genre of given id", async () => {
      // genres = new Genres({ name: "genre1" });
      // await genres.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 error for invalid id", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 error if genre is not found", async () => {
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "genre1";
    });
    it("should return 401 if the use not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre's length is less than 3", async () => {
      name = "12";
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre's length is more than 53", async () => {
      name = new Array(54).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should save genre if it is valid", async () => {
      await exec();
      const genre = await Genres.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
  describe("PUT /", () => {
    it("should return 404 if the genre is not found", async () => {
      const res = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "new genre" });
      expect(res.status).toBe(404);
    });
    it("should return updated genre for valid request", async () => {
      const res = await request(server)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "genre3" });
      expect(res.body.name).toBe("genre3");
    });
  });
  describe("DELETE /", () => {
    it("should return 403 if the user is not admin", async () => {
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });
    it("should return 404 if the genre is not found", async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
    it("should return the deleted genre ", async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
