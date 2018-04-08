var mongoose = require("mongoose");
var Makeup = require("./models/makeup");
var Review   = require("./models/review");

var data = [
    {
        name: "Too Faced Mascara",
        image: "https://www.sephora.com/productimages/sku/s1533439-main-Lhero.jpg",
        description: "blah blah blah"
    },
    {
        name: "Kat Von D Liquid Lipstick",
        image: "https://www.sephora.com/productimages/sku/s1890623-main-hero-300.jpg",
        description: "blah blah blah"
    },
    {
        name: "Giorgio Armani Foundation",
        image: "https://www.sephora.com/productimages/sku/s1359553-main-Lhero.jpg",
        description: "blah blah blah"
    }
]

function seedDB(){
   //Remove all makeup
   Makeup.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed makeup!");
         //add makeup
        data.forEach(function(seed){
            Makeup.create(seed, function(err, makeup){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a makeup");
                    //create a review
                    Review.create(
                        {
                            text: "This is the best product I have ever bought",
                            author: "Princess"
                        }, function(err, review){
                            if(err){
                                console.log(err);
                            } else {
                                makeup.reviews.push(review);
                                makeup.save();
                                console.log("Created new review");
                            }
                        });
                }
            });
        });
    });
    //add a few reviews
}

module.exports = seedDB;
