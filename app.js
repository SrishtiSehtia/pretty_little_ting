var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Makeup      = require("./models/makeup"),
    seedDB      = require("./seeds")

mongoose.connect("mongodb://localhost/plt");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


// var makeup = [
//         {name: "Too Faced Mascara", image: "https://www.sephora.com/productimages/sku/s1533439-main-Lhero.jpg"},
//         {name: "Kat Von D Liquid Lipstick", image: "https://www.sephora.com/productimages/sku/s1890623-main-hero-300.jpg"},
//         {name: "Giorgio Armani Foundation", image: "https://www.sephora.com/productimages/sku/s1359553-main-Lhero.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing");
});


//INDEX - show all makeup
app.get("/makeup", function(req, res){
    // Get all makeup from DB
    Makeup.find({}, function(err, allMakeup){
       if(err){
           console.log(err);
       } else {
          res.render("makeup/index",{makeup:allMakeup});
       }
    });
});

//CREATE - add new makeup to DB
app.post("/makeup", function(req, res){
    // get data from form and add to makeup array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newMakeup = {name: name, image: image, description: desc}
    // Create a new makeup and save to DB
    Makeup.create(newMakeup, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to makeup page
            res.redirect("/makeup");
        }
    });
});

//NEW - show form to create new makeup
app.get("/makeup/new", function(req, res){
   res.render("makeup/new");
});

// SHOW - shows more info about one makeup
app.get("/makeup/:id", function(req, res){
    //find the makeup with provided ID
    Makeup.findById(req.params.id).populate('comments').exec(function(err, foundMakeup){
        if(err){
            console.log(err);
        } else {
            //render show template with that makeup
            res.render("makeup/show", {makeup: foundMakeup});
        }
    });
})

// ====================
// COMMENTS ROUTES
// ====================

app.get("/makeup/:id/comments/new", function(req, res){
    // find makeup by id
    Makeup.findById(req.params.id, function(err, makeup){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {makeup: makeup});
        }
    })
});

// Server Started
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
