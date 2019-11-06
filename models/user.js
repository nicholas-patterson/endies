"use strict";
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          return bcrypt.hash(user.password, 10).then(hash => {
            user.password = hash;
          });
        }
      }
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Todos, {
      foreignKey: "userId"
    });
  };
  return User;
};
