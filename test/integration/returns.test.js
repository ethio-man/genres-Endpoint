import moment from "moment";
import mongoose from "mongoose";
import request from "supertest";
import { Rental } from "../../model/rental.js";
import { User } from "../../model/user.js";
import { Movies } from "../../model/movies.js";

describe("/api/returns", () => {
  let server, rental, customerId, movieId, token, movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    ({ default: server } = await import("../../index.js"));

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "abc",
        phone: "0901234567",
      },
      movies: {
        _id: movieId,
        title: "xyz",
        dailyRentalRate: 2,
      },
    });
    await rental.save();

    movie = new Movies({
      _id: movieId,
      title: "abc",
      genre: { name: "xyz" },
      numberInStock: 0,
      dailyRentalRate: 2,
    });
    await movie.save();
  });

  afterEach(async () => {
    if (server && server.close) {
      await new Promise((resolve) => server.close(resolve));
    }
    await Rental.deleteMany({});
    await Movies.deleteMany({});
    jest.resetModules();
  });

  it("should return 401 if the user not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if valid customerId not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if valid movieId not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if rental is not found", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if rental already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it("should return 200 if valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set return date", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const deff = new Date() - rentalInDb.dateReturned;
    expect(deff).toBeLessThan(10 * 1000);
  });
  it("should calculate the rental fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });
  it("should increase number in  stock", async () => {
    await exec();
    const movieInDb = await Movies.findById(movie._id);
    expect(movieInDb.numberInStock).toBe(1);
  });
  it("should return rentals if valid request", async () => {
    const res = await exec();
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "customer",
        "movies",
        "dateOut",
        "dateReturned",
        "rentalFee",
      ])
    );
  });
});
