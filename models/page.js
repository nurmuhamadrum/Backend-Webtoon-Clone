'use strict';
module.exports = (sequelize, DataTypes) => {
  const page = sequelize.define('page', {
    page: DataTypes.STRING,
    image: DataTypes.STRING,
    episode_id: DataTypes.INTEGER,
  }, {});
  page.associate = function (models) {
    // associations can be defined here
    page.belongsTo(models.episode, {
      as: 'episodeID',
      foreignKey: 'episode_id',
    })
  }
  return page;
};