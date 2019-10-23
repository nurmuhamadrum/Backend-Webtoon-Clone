module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'nurmuhamadrum16@gmail.com',
        password: '1234',
        name: 'Nur Muhamad. R'
      },
      {
        email: 'nurmuhamadrum@gmail.com',
        password: '1234',
        name: 'Nur Muhamad'
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};