/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");

//Initializing variables

let gameData;

//Initializing gameData, a variable that will later hold the data sent back from the IGDB API. It is declared globally so two different routes can use it.

module.exports = function(app) {
  //This request handler is used to authenticate a user's password and email when they login. It creates a user object that is then attached to each request.

  app.post("/api/loginPage", passport.authenticate("local"), function(
    req,
    res
  ) {
    res.status(200).end();
  });

  //This request handler is used to create a user account.


  app.post("/api/createAccount", function(req, res) {
    db.users
      .create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.first,
        lastName: req.body.last
      })
      .then(() => res.status(201).end())
      .catch(err => {
        res.status(401).json(err);
      });
  });

  //This request uses the gameData variable, which is declared globally, and stores the information from the IGDB api in an array,
  //  to send the data on games to results page, which is rendered in Handlebars.

  // The api requests game data in using unique parameters that correspond to Rorschach test answers,
  //  such as time to complete a game in minutes, and rating out to approx 10 decimal points.
  //  The loop within this request handler cleans that data up for presentation.

  app.get("/api/gamesDisplay", function(req, res) {
    if (gameData.length === 0) {
      res.render("noGames");
    }

    if (gameData.length !== 0) {
      for (let game of gameData) {
        let { total_rating } = game;

        let roundedRating = Math.round(total_rating);
        game.total_rating = roundedRating;

        let { time_to_beat } = game;
        let hoursToBeat =
          Math.round(time_to_beat / 60).toString() +
          "hrs " +
          (time_to_beat % 60).toString() +
          "mins";
        game.time_to_beat = hoursToBeat;
      }

      res.render("index", {
        games: gameData
      });
    }
  });

  //this request handler receives the values sent in when the users complete their Rorschach tests. 
  // It then converts this data into style that the api will understand in its query filters. 
  // It then queries the api. The game data returned is then stored in gameData to be rendered by the request handler above. 
  // Lastly, The response of this request handler redirects to the route above.

  app.get("/api/games", function(req, res) {
    let { category, rating, released_date, multiplayer, genre } = req.query;

    let categoryEnum = 0;

    let minRatingScore = 0;

    let maxRatingScore = 0;

    let minDate = 0;

    let maxDate = 0;

    let multiplayerStatus =
      multiplayer === "multi" ? "multiplayer" : "single-player";

    let [genreOne, genreTwo, genreThree] = genre.split(", ");

    switch (category) {
    case "remaster":
      categoryEnum = 9;
      break;
    case "mod":
      categoryEnum = 5;
      break;  
    case "main":
      categoryEnum = 0;
      break;
    }

    //determining what constitutes a low/med/high rating for a game
    switch (rating) {
    case "low":
      maxRatingScore = 80;
      break;
    case "medium":
      minRatingScore = 80;
      maxRatingScore = 86;
      break;
    case "high":
      minRatingScore = 86;
      maxRatingScore = 100;
      break;
    }

    //determining when an old, medium, and new game would be released, then converting it to unix time.
    switch (released_date) {
    case "old":
      minDate = new Date("1972.01.01").getTime() / 1000;
      maxDate = new Date("2010.01.01").getTime() / 1000;
      break;
    case "medium":
      minDate = new Date("2010.01.01").getTime() / 1000;
      maxDate = new Date("2016.01.01").getTime() / 1000;
      break;
    case "new":
      minDate = new Date("2016.01.01").getTime() / 1000;
      maxDate = new Date("2019.06.01").getTime() / 1000;

      break;
    }

    const data = `fields name, screenshots.*, summary, platforms.slug, total_rating, cover.*, genres.slug, category; where (release_dates.date > ${minDate} & release_dates.date <= ${maxDate} & category=${categoryEnum} & rating > ${minRatingScore} & rating<= ${maxRatingScore} & game_modes.slug = "${multiplayerStatus}") & (genres.slug = "${genreOne}" | genres.slug = "${genreTwo}" | genres.slug = "${genreThree}"); sort popularity desc;`;

    axios({
      url: "https://api.igdb.com/v4/games",
      method: "POST",
      headers: {
        Accept: "application/json",
        // "user-key": process.env.API_KEY
        "Client-ID": "t0vxm7u1khhtetef2hktim3rz88j3d",
        "Authorization": "Bearer uo8avsfdtwe0dawtd9jkc5ybd9lgeu"
      },
      data,
    })
      .then(response => {
        gameData = response.data;

        res.status(200).end();
      })
      .catch(err => {
        console.error(err);
      });
  });

  //this request handler stores the id that identifies a game to the API within our mySQL database alongisde the id of the user (a foreign key) who preferred it.
  app.post("/api/preferences", (req, res) => {
    if (req.user) {
      db.games
        .create({
          userId: req.user.id,
          id_from_database: req.body.savedGameId
        })
        .then(data => {
          res.status(200).json(data);
        });
    } else {
      res.json("loginPrompt");
    }
  });


  //this request handler logs out the user, and then redirects to the homepage.
  app.get("/logout", function(req, res) {

    req.logout();
    res.redirect("/");
  });
};

