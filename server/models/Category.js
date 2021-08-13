const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
