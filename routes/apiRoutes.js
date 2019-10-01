var db = require("../models");
var passport = require("../config/passport");
const axios = require("axios")

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    }
    
    );
  }
  );

// app.get('/x/y')

// $.ajax({
//   method: 'GET',
//   url: '/api/games'
//   data: {
//     rating: $('#ratingInput').val().trim()
//   }
// })

// '/x' -> '/profile'

// '/y' -> '/profile?scroll=true'

// if (window.location.query.scroll) {
//   // scroll user somwhere
// }

// window.location.query

  //post for sign in

  //post for pick a reference

  app.get("/api/games", function(req, res) {
    console.log(req.query);


    axios({
      url: "https://api-v3.igdb.com/games",
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'user-key': "1c746b7def293989e73177e70e53a42f"
      },
      data: "fields name, genres, summary, total_rating,  videos, themes,  platforms, popularity, time_to_beat, artworks;where rating >= 80 & release_dates.date > 631152000 & time_to_beat>= 500 & multiplayer_modes.onlinecoop = true & theme = horror;"
    })
      .then(response => {
          res.json(response.data);
      })
      .catch(err => {
          console.error(err);
      });

      
    // db.Example.create(req.body).then(function(dbExample) {
    //   res.json(dbExample);
    // });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
