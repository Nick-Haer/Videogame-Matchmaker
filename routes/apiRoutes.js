var db = require("../models");
var passport = require("../config/passport");
const axios = require("axios")


let gameData;

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
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

  app.get("/api/gamesDisplay", function (req, res) {

    res.render("index", {
      games: gameData
    })

  })

  app.get("/api/games", function (req, res) {
    // console.log(req.query);

    let { time, rating, released_date, multiplayer, genre } = req.query;

    // console.log(multiplayer)


    // console.log(multiplayerStatus)

    let genreId = 0;


    let minMinsToComplete = 0;

    let maxMinsToComplete = 0;


    let minRatingScore = 0;

    let maxRatingScore = 0;


    let minDate = 0;

    let maxDate = 0;

    //finding the correct genre id to use in the query

    let multiplayerStatus = (multiplayer === "multi") ? "multiplayer" :  "single-player";

    console.log(multiplayerStatus)

    console.log(genre)

    switch (genre) {
      case "strategy":
        genreId = 15

        break;
      case "sport":
        genreId = 14

        break;
      case "puzzle":
        genreId = 9

        break;
      case "adventure":
        genreId = 31

        break;
      case "indie":
        genreId = 32

        break;
      case "rpg":
        genreId = 12

        break;
      case "shooter":
        genreId = 5

        break;
    }


    switch (time) {
      case "short":
        maxMinsToComplete = 500

        break;
      case "medium":
        minMinsToComplete = 500;
        maxMinsToComplete = 1250

        break;
      case "long":
        minMinsToComplete = 1250;
        maxMinsToComplete = 99999;

        break;
    }
    switch (rating) {
      case "low":
        maxRatingScore = 70;
        break;
      case "medium":
        minRatingScore = 70;
        maxRatingScore = 85;
        break;
      case "high":
        minRatingScore = 85;
        maxRatingScore = 100;

        break;
    }
    switch (released_date) {
      case "old":
        minDate = new Date('1972.01.01').getTime() / 1000
        maxDate = new Date('2000.01.01').getTime() / 1000
        break;
      case "medium":
        minDate = new Date('2000.01.01').getTime() / 1000
        maxDate = new Date('2010.01.01').getTime() / 1000
        console.log("gotem")

        break;
      case "new":
        minDate = new Date('2010.01.01').getTime() / 1000
        maxDate = new Date('2019.06.01').getTime() / 1000

        break;
    }

    console.log(minDate)
    console.log(maxDate)

    // release_dates.date > ${minDate} & release_dates.date <= ${maxDate} & where rating > ${minRatingScore} & rating<= ${maxRatingScore} & time_to_beat> ${minMinsToComplete} & time_to_beat<= ${maxMinsToComplete} & multiplayer_modes.onlinecoop = ${multiplayerStatus} & genres = [${genreId}];

    //screenshots.*

    //solve by reducing options to two? or by reducing number of options
    axios({
      url: "https://api-v3.igdb.com/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'user-key': "1c746b7def293989e73177e70e53a42f"
      },
      data: `fields name; where release_dates.date > ${minDate} & release_dates.date <= ${maxDate} & rating > ${minRatingScore} & rating<= ${maxRatingScore} & time_to_beat> ${minMinsToComplete} & time_to_beat<= ${maxMinsToComplete} & game_modes.slug = "${multiplayerStatus}" & genres = [${genreId}]; sort popularity desc;`
    })
      .then(response => {

        gameData = response.data

        // console.log(Object.keys(response))
        // console.log(response.data)


        // res.render("index",
        // {
        //   games: data
        // })
        res.status(200).end()
        // res.json(response.data);
      })
      .catch(err => {
        console.error(err);
      });


    // db.Example.create(req.body).then(function(dbExample) {
    //   res.json(dbExample);
    // });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
