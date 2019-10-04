var db = require("../models");
const axios = require("axios")

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.json("hello")
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.render("index", {
    //     msg: "Welcome!",
    //     examples: dbExamples
    //   });
    // }
    // );
  });



  //get games I matched with

  //get contact us

  //get about us

  //get preferences

  //sign-in


  // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });



  app.get("/preferences", (req, res) => {



  if (req.user) {



    console.log(Object.keys(req.user))

    db.games.findAll({
      attributes: ["id_from_database"],
      where: {
        userId: req.user.id
      }
      // include: [db.users]
  }).then((data) => {
    console.log(data)




    let queryStringAdditions = ``
    for (let i = 0; i < data.length; i++) {
      let gameId = data[i].dataValues.id_from_database

      if (!duplicateCheck.includes(gameId)) {
        duplicateCheck.push(gameId)

        if (i !== 0) {
          queryStringAdditions +=` | `
        }
        queryStringAdditions += `id=${gameId}`
  
      }

    }

    console.log(queryStringAdditions)

    axios({
      url: "https://api-v3.igdb.com/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.API_KEY
      },
      data: `fields name, screenshots.*, summary, platforms.slug, total_rating, cover.*, genres.slug, time_to_beat; where ${queryStringAdditions};` 
    })
      .then(response => {

        gameData = response.data
        console.log(gameData)
        res.status(200).render("preferences", {
          games: gameData
        }
        )
      })
      .catch(err => {
        console.log(err)
      })




  })
  
  } else {
    res.render("signInPrompt")
  }



    


  })

  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
