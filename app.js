var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var makeup = [
        {name: "Too Faced Mascara", image: "https://www.sephora.com/productimages/sku/s1533439-main-Lhero.jpg"},
        {name: "Kat Von D Liquid Lipstick", image: "https://www.sephora.com/productimages/sku/s1890623-main-hero-300.jpg"},
        {name: "Giorgio Armani Foundation", image: "https://www.sephora.com/productimages/sku/s1359553-main-Lhero.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/makeup", function(req, res){
    res.render("makeup",{makeup:makeup});
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
