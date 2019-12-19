# Project Features
1. [Overview](#Overview)
2. [Technology Used](#Technology-Used)
3. [Challenges](#Challenges)
4. [Final Thoughts](#Final-Thoughts)

## Overview

This offbeat app helps users match with new video games by using the results of a series of Rorschach tests. The results from the tests are transformed into a list of games from the IGDB game database. Users can also create accounts/login, and save the games they clicked with to come back to later.

Check out this project deployed to heroku [here](https://next-venture.herokuapp.com/)

## Technology-Used


* Passport User Auth Library
* Node
* Express
* Handlebars
* Sequelize
* MySQL
* Axios

## Challenges

As is often the case, the greatest challenges this project presented came in the form of a technology used for the first time, in this case user authentication and login. This was accomplished using the Passport library, which was at first glance quite complex, but steadily became more simple as we wove the authentication code into our app. Not as technically difficult, but very time intensive, was deciding how to translate the results from the rorschach tests into queries that would almost always retrieve games, while also being relevant to the results of the tests.

## Final-Thoughts

This project was very time intensive, but generally went very smoothly. We tried out some new things with this one, including stored user data and an animated background. When it was finished, I was glad to see it was as fun to play around with as I'd hoped. Go ahead and try it out!
