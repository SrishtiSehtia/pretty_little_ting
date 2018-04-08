var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Makeup      = require("./models/makeup"),
    Review      = require("./models/review"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

mongoose.connect("mongodb://localhost/plt");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
    Makeup.findById(req.params.id).populate('reviews').exec(function(err, foundMakeup){
        if(err){
            console.log(err);
        } else {
            console.log(foundMakeup)
            //render show template with that makeup
            res.render("makeup/show", {makeup: foundMakeup});
        }
    });
})

// ====================
// reviewS ROUTES
// ====================

app.get("/makeup/:id/reviews/new", function(req, res){
    // find makeup by id
    Makeup.findById(req.params.id, function(err, makeup){
        if(err){
            console.log(err);
        } else {
             res.render("reviews/new", {makeup: makeup});
        }
    })
});

app.post("/makeup/:id/reviews", function(req, res){
   //lookup makeup using ID
   Makeup.findById(req.params.id, function(err, makeup){
       if(err){
           console.log(err);
           res.redirect("/makeup");
       } else {
        Review.create(req.body.review, function(err, review){
           if(err){
               console.log(err);
           } else {
               makeup.reviews.push(review);
               makeup.save();
               res.redirect('/makeup/' + makeup._id);
           }
        });
       }
   });
   //create new review
   //connect new review to makeup
   //redirect makeup show page
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/makeup");
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/makeup",
        failureRedirect: "/login"
    }), function(req, res){
});

// Server Started
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
