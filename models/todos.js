"use strict";
module.exports = (sequelize, DataTypes) => {
  const Todos = sequelize.define(
    "Todos",
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {}
  );
  Todos.associate = function(models) {
    // associations belong here
  };
  return Todos;
};
