/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
var db = require("../models");
const axios = require("axios");

module.exports = function(app) {
  //this request handler checks to see if a user is logged in by checking for req.user. If they are logged in, it will query all games that player has stored, using the user's id.

  app.get("/preferences", (req, res) => {
    if (req.user) {
      db.games
        .findAll({
          attributes: ["id_from_database"],
          where: {
            userId: req.user.id
          }
        }).then((data) => {
          console.log(data);

          //If a user accidentally prefers a game twice, then a check against duplicates array will keep the game from being queried twice, possibly breaking the api query.
          //The loop below creates a query string to query for games from the IGDB by id.
          let duplicateCheck = [];
          let queryStringAdditions = "";
          for (let i = 0; i < data.length; i++) {
            let gameId = data[i].dataValues.id_from_database;

            if (!duplicateCheck.includes(gameId)) {
              duplicateCheck.push(gameId);

              if (i !== 0) {
                queryStringAdditions += " | ";
              }
              queryStringAdditions += `id=${gameId}`;
            }
          }

          console.log(queryStringAdditions);

          axios({
            url: "https://api-v3.igdb.com/games",
            method: "POST",
            headers: {
              Accept: "application/json",
              "user-key": process.env.API_KEY
            },
            data: `fields name, screenshots.*, summary, platforms.slug, total_rating, cover.*, genres.slug, time_to_beat; where ${queryStringAdditions};` 
          })
            .then(response => {
              gameData = response.data;

              //prettying up the data for presentation, as follows the api query results in apiRoutes as well.

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

              res.status(200).render("preferences", {
                games: gameData
              });
            });
        })
        .catch(err => {
          console.log(err);
        });



      //if the user is not signed in, a a handlebars prompt is rendered instead, prompting them to do so.
    } else {
      res.render("signInPrompt");
    }
  });

  //kept to reference for a potential future addition for providing more specific information about a game.

  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
