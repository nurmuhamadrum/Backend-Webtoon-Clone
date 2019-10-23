'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('episodes', [
      {
        title: "Ep. 1",
        image: "https://swebtoon-phinf.pstatic.net/20181216_255/1544969692753DOGep_JPEG/thumb_ipad.jpg",
        webtoon_id: "1"
      },
      {
        title: "Ep. 2",
        image: "https://swebtoon-phinf.pstatic.net/20170920_252/1505841402766Ii51H_JPEG/thumb_ipad.jpg",
        webtoon_id: "1"
      },
      {
        title: "Ep. 3",
        image: "https://swebtoon-phinf.pstatic.net/20170328_259/1490685279119wFmiy_JPEG/thumb_ipad.jpg",
        webtoon_id: "1"
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('episodes', null, {});
  }
};