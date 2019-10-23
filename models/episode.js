'use strict';
module.exports = (sequelize, DataTypes) => {
  const episode = sequelize.define('episode', {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    webtoon_id: DataTypes.INTEGER
  }, {});
  episode.associate = function (models) {
    // associations can be defined here
    episode.belongsTo(models.webtoons, {
      as: 'webtoonID',
      foreignKey: 'webtoon_id'
    })
  };
  return episode;
};