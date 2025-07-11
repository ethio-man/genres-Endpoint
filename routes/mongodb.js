const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/genres")
  .then(() => console.log("Successfuly connected to database ."))
  .catch((err) => console.log(err.message));
const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Action", "Romantic", "Chartoon"],
    required: true,
  },
  price: Number,
});

const Genres = mongoose.model("Genres", genreSchema);

async function createGenre(body) {
  try {
    const genre = new Genres({
      name: body.name,
      category: body.category,
      price: body.price,
    });
    const result = await genre.save();
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}
//createGenre();

module.exports = mongoose;
