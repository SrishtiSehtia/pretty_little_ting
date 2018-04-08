var mongoose = require("mongoose");

var makeupSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

module.exports = mongoose.model("Makeup", makeupSchema);
