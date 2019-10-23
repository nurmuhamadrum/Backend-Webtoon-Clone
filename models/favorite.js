'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
    user_id: DataTypes.INTEGER,
    webtoon_id: DataTypes.INTEGER
  }, {});
  favorite.associate = function (models) {
    favorite.belongsTo(models.webtoons, {
      as: "webtoons",
      foreignKey: "webtoon_id"
    })
    // favorite.belongsTo(models.user, {
    //   as: "userId",
    //   foreignKey: "user_id"
    // })
  }
  return favorite;
};