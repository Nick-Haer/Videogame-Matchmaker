const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios")

console.log(db.sequelize)
console.log(Object.keys(db))


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

  app.post("/api/loginPage", passport.authenticate("local"), function(req, res) {
    res.status(200).end()
  });


  
  app.post("/api/createAccount", function(req, res) {
    console.log(Object.keys(req.body))

    db.users.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.first,
      lastName: req.body.last
    })
      .then(() => {
        // res.redirect(307, "/api/loginPage");

      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  //post for pick a reference

  app.get("/api/gamesDisplay", function (req, res) {


    for (let game of gameData) {
      // console.log(game.total_rating)
      let {total_rating} = game
      // console.log(total_rating)
      let roundedRating = Math.round(total_rating)
      game.total_rating = roundedRating 


      let {time_to_beat} = game;
      let hoursToBeat = Math.round((time_to_beat / 60)).toString() +"hrs " + (time_to_beat % 60).toString() + "mins";
      game.time_to_beat = hoursToBeat;
    }

    res.render("index", {
      games: gameData
    })

  })

  app.get("/api/games", function (req, res) {
    // console.log(req.query);
    console.log(req.user);
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

    let [genreOne, genreTwo, genreThree] = genre.split(", ");

    console.log(genreOne)


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
        'user-key': process.env.API_KEY
      },
      data: `fields name, screenshots.*, summary, platforms.slug, total_rating, cover.*, genres.slug, time_to_beat; where (release_dates.date > ${minDate} & release_dates.date <= ${maxDate} & rating > ${minRatingScore} & rating<= ${maxRatingScore} & time_to_beat> ${minMinsToComplete} & time_to_beat<= ${maxMinsToComplete} & game_modes.slug = "${multiplayerStatus}") & (genres.slug = "${genreOne}" | genres.slug = "${genreTwo}" | genres.slug = "${genreThree}"); sort popularity desc;`
    })
      .then(response => {

        gameData = response.data
        // console.log(gameData)

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



  app.post("/api/preferences", (req, res) => {


    console.log(req.body.id_from_database)
    console.log(req.user)
    console.log("path")


    if(req.user) {

      console.log("logged in")
      db.games.create({
        userId: req.user.id,
        id_from_database: req.body.savedGameId
      }).then((data) => {
        res.status(200).json(data)
        console.log(data)
      })
    } else {
      // res.render("singInPrompt")
    }
  })

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
