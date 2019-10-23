'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('webtoons', [
      {
        title: "Tahilalats",
        genre: "Comedy",
        isFavorite: true,
        image: "https://swebtoon-phinf.pstatic.net/20181216_255/1544969692753DOGep_JPEG/thumb_ipad.jpg",
        created_by: 1
      },
      {
        title: "Si Ocong",
        genre: "Comedy",
        isFavorite: true,
        image: "https://swebtoon-phinf.pstatic.net/20170920_252/1505841402766Ii51H_JPEG/thumb_ipad.jpg",
        created_by: 1
      },
      {
        title: "Si Juki",
        genre: "Comedy",
        isFavorite: true,
        image: "https://swebtoon-phinf.pstatic.net/20170328_259/1490685279119wFmiy_JPEG/thumb_ipad.jpg",
        created_by: 1
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('webtoons', null, {});
  }
};
