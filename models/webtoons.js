'use strict';
module.exports = (sequelize, DataTypes) => {
  const webtoons = sequelize.define('webtoons', {
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    isFavorite: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {});
  webtoons.associate = function (models) {
    // associations can be defined here
    webtoons.belongsTo(models.user, {
      as: 'createdBy',
      foreignKey: 'created_by',
    })
    webtoons.belongsToMany(models.user, {
      through: models.favorite,
      as: 'users',
      foreignKey: 'webtoon_id'
    })
  }
  return webtoons;
}