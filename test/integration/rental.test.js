import request from "supertest";
import mongoose from "mongoose";
import { Rental } from "../../model/rental.js";
import { Customers } from "../../model/customer.js";
import { Movies } from "../../model/movies.js";
import { Genres } from "../../model/genre.js";

let server, customer, movie, rental, genre, customerId, movieId;

const exec = () => {
  return request(server).post("/api/rentals").send({ customerId, movieId });
};
describe("/api/rentals", () => {
  beforeEach(async () => {
    ({ default: server } = await import("../../index.js"));

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "aaa",
        phone: "0901234567",
      },
      movies: {
        _id: movieId,
        title: "zzz",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
    }
    await Rental.deleteMany({});
    jest.resetModules();
  });

  describe("GET /", () => {
    it("should return all rentals", async () => {
      const res = await request(server).get("/api/rentals");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some((g) => g.customer.name === "aaa")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if rental not found", async () => {
      const res = await request(server).get("/api/rentals/" + movieId);

      expect(res.status).toBe(404);
    });
    it("should return rental of a given valid id", async () => {
      const res = await request(server).get("/api/rentals/" + rental._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("movies.title", rental.movies.title);
    });
  });
  describe("POST /", () => {
    it("should return 400 for invalid customerId or moviesId", async () => {
      customerId = "";
      movieId = "";

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if customer not found ", async () => {
      customerId = new mongoose.Types.ObjectId();

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if movie not found ", async () => {
      movieId = new mongoose.Types.ObjectId();

      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});
