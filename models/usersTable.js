var bcrypt = require("bcryptjs");
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE
  });
  Users.associate = (models) =>{
    Users.hasMany(models.games)
  }

  Users.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  Users.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return Users;
};

//the users table is initialized here. This table has a one to many relationship with each game the user chooses to save to preferences.