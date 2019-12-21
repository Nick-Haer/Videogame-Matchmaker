/* eslint-disable camelcase */
module.exports = function(sequelize, DataTypes) {
  var Games = sequelize.define("games", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_from_database: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Games;
};

//Creating the table that will hold the id of all games a user chooses to add to preferences. The inserted id will be used to query the IGDB api, and populate the page with preferred games
