'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'firstName', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'lastName', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'moderator'),
      allowNull: true,
      defaultValue: 'user',
    });

    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'firstName');
    await queryInterface.removeColumn('users', 'lastName');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'isActive');
  }
}; 