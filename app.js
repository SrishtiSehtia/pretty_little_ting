var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/plt");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var makeupSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Makeup = mongoose.model("Makeup", makeupSchema);

var makeup = [
        {name: "Too Faced Mascara", image: "https://www.sephora.com/productimages/sku/s1533439-main-Lhero.jpg"},
        {name: "Kat Von D Liquid Lipstick", image: "https://www.sephora.com/productimages/sku/s1890623-main-hero-300.jpg"},
        {name: "Giorgio Armani Foundation", image: "https://www.sephora.com/productimages/sku/s1359553-main-Lhero.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});


//INDEX - show all makeup
app.get("/makeup", function(req, res){
    // Get all makeup from DB
    Campground.find({}, function(err, allMakeup){
       if(err){
           console.log(err);
       } else {
          res.render("index",{makeup:allMakeup});
       }
    });
});

app.post("/makeup", function(req, res){
    // get data from form and add to makeup array
    var name = req.body.name;
    var image = req.body.image;
    var newMakeup = {name: name, image: image}
    makeup.push(newMakeup);
    //redirect back to makeup page
    res.redirect("/makeup");
});

app.get("/makeup/new", function(req, res){
   res.render("new.ejs");
});

// Server Started
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
