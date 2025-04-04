'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "country", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("Users", "city", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("Users", "state", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn("Users", "gender", {
        type: Sequelize.ENUM("Male", "Female", "Other"),
        allowNull: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "country"),
      queryInterface.removeColumn("Users", "city"),
      queryInterface.removeColumn("Users", "state"),
      queryInterface.removeColumn("Users", "gender"),
    ]);
  },
};


