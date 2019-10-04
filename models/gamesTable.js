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
