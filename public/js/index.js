

$(document).ready(function () {


  $("#signup-btn").on("click", function (event) {

    event.preventDefault()

    //On clicking the signup button, a post requst is sent to the api routes file, which then stores the users data in a mySQL database, creating an accoun.


    $.post("/api/createAccount", {
      email: $("#signUpEmail").val().trim(),
      password: $("#signUpPassword").val().trim(),
      first: $("#first-name-input").val().trim(),
      last: $("#last-name-input").val().trim()
    })
      .then(response => {
        window.location.reload();
        alert("Access Granted! You may proceed to login")
        console.log(response)
      })
      .catch(err => {
        throw err;
      })


  })

  //This route is used for logging in, routing to a request handler found in the apiRoutes file. The passport middleware will run on the request, validating the users email and password.

  $("#login-btn").on("click", function (event) {
    event.preventDefault()

    $.post("/api/loginPage", {
      email: $("#loginEmail").val().trim(),
      password: $("#loginPassword").val().trim()
    }).then(function () {

    })
      .catch(function (err) {
        console.log(err);
      });

  })

  //This route is key to the app. When the user submits his rorsach tests, this route will send the values to a request handler in apiRoutes, which will then change it into a style the api can understand as filter parameters. This is what provides customized game results.

  $("#submit-btn").on("click", function () {

    event.preventDefault()


    $.ajax({
      method: "GET",
      url: "/api/games",
      data: {
        time: $("#time").val(),
        rating: $("#rating").val(),
        released_date: $("#released_date").val(),
        multiplayer: $("#multiplayer").val(),
        genre: $("#genre").val(),
      }
    })
      .then(response => {
        window.location.href = "/api/gamesDisplay"
        console.log(response)


      })
      .catch(err => {
        throw err;
      })

  })

  //This route is triggered whenever a user clicks the botton to save a game as preferred. It extracts the game's id, which is used to query that game in the Api's database. A request handler in apiRoutes will then store this data in our mysql database, for later use when rendering the preferences page.

  $(".preferGame").on("click", (event) => {

    event.preventDefault()

    console.log("clicked")

    $.ajax({
      method: "POST",
      url: "/api/preferences",
      data: {
        savedGameId: event.target.id
      }

    }).then((res) => {

      if (res == "loginPrompt") {
        window.location.href = "/preferences"
      }

    }).catch(err => {
      console.log(err)
    })


  })

  
})
