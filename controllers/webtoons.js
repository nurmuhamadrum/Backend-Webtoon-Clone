const models = require('../models')
const Webtoon = models.webtoons
const User = models.user
const Episode = models.episode
const Page = models.page
const Favorite = models.favorite;

const getWebtoons = data => { // Get all Webtoons (Fungsi jika false) (18.Favorite)
    const newFav = data.map(item => {
        let newItem = {
            id: item.id,
            title: item.title,
            isFavorite: item.isFavorite,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            createdBy: item.createdBy.id
        }
        return newItem
    })
    return newFav
}

const getFavWebtoons = data => { // Get All Favorite Webtoon (Fungsi jika true) (18.Favorite)
    const input = data.filter(item => {
        return item.isFavorite
    })

    let newFav = input.map(item => {
        let newItem = {
            title: item.title,
            isFavorite: item.isFavorite,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
        return newItem
    })
    return newFav
}

const getWebtoonsByTitle = (data, title) => { // Get Webtoon by Title (19.Search_Webtoon_Implementation)
    const input = data.filter(item => {
        return item.title.toUpperCase().includes(title.toUpperCase())
    })
    let newFav = input.map(item => {
        let newItem = {
            title: item.title,
            isFavorite: item.isFavorite,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
        return newItem
    })
    return newFav
}

exports.getAllWebtoons = (req, res) => { // Get All Webtoons (Index) (15.For_You_Implementation)
    Webtoon.findAll({
        include: [
            {
                model: User,
                as: "createdBy",
                attributes: ["id"]
            },
        ]
    }).then(data => { // Sebuah Promise
        let newFav

        if (req.query.is_favorite == "true") {
            newFav = getFavWebtoons(data) // Maka jalankan fungsi getFavWebtoons
        } else if (req.query.title) {
            newFav = getWebtoonsByTitle(data, req.query.title) // Maka jalankan fungsi getWebtoonByTitle
        } else {
            newFav = getWebtoons(data) // Maka jalankan fungsi getWebtoons
        }

        res.send(newFav)
    })
}

// Function Get User Favprites
const getUserFavs = data => {
    let newData = data.map(item => {
        let newItem = {
            id: item.webtoons.id,
            title: item.webtoons.title,
            image: item.webtoons.image,
            createdAt: item.webtoons.createdAt,
            updatedAt: item.webtoons.updatedAt
        };
        return newItem;
    });
    return newData;
};

// Delete Favorite
exports.deleteFavorites = (req, res) => {
    const { user_id, webtoon_id } = req.params;

    Favorite.destroy({
        where: { user_id, webtoon_id: webtoon_id }
    }).then(deletedRow => {
        if (deletedRow > 0) {
            Favorite.findAll({
                include: [
                    {
                        model: Webtoon,
                        as: "webtoons",
                        attributes: {
                            exclude: ["created_by"]
                        },
                    }
                ],
                attributes: [],
                where: { user_id }
            }).then(data => {
                res.send(getUserFavs(data)); // Function Get User Favorites
            });
        } else {
            res.status(404).json({ message: "nothing to delete" });
        }
    });
};

// Function Get User Favorite
const getUserFavorites = data => {
    let newData = data.map(item => {
        let newItem = {
            id: item.webtoons.id,
            title: item.webtoons.title,
            image: item.webtoons.image,
            createdAt: item.webtoons.createdAt,
            updatedAt: item.webtoons.updatedAt
        };
        return newItem;
    });
    return newData;
};

// Post Favorite
exports.postFavorites = (req, res) => {
    const { user_id, webtoon_id } = req.params;

    User.findOne({
        where: {
            id: user_id
        },
        attributes: ["id"]
    }).then(user => {
        if (user) {
            Webtoon.findOne({
                where: {
                    id: webtoon_id
                },
                attributes: ["id"]
            }).then(toon => {
                if (toon) {
                    Favorite.findOne({
                        where: {
                            user_id: user.id,
                            webtoon_id: toon.id
                        }
                    }).then(data => {
                        if (data) {
                            res.status(400).json({ message: "Webtoon has been Favorited" });
                        } else {
                            Favorite.create({
                                user_id,
                                webtoon_id: webtoon_id
                            }).then(item => {
                                Favorite.findAll({
                                    include: [
                                        {
                                            model: Webtoon,
                                            as: "webtoons",
                                            attributes: {
                                                exclude: ["created_by"]
                                            },
                                        }
                                    ],
                                    attributes: [],
                                    where: { user_id: item.user_id }
                                }).then(data => {
                                    res.send(getUserFavorites(data)); // Function Untuk Menampilkan Favorite
                                })
                            })
                        }
                    })
                } else {
                    res.status(400).json({ message: "Bad Request 2" });
                }
            })
        } else {
            res.status(400).json({ message: "Bad Request 3" });
        }
    })
}

// Get Favorite
exports.getFavorites = (req, res) => {
    const userId = req.params.user_id;

    Favorite.findAll({
        where: { user_id: userId },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
        include: [
            {
                model: Webtoon,
                as: "webtoons",
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                }
            }
        ],
    }).then(data => {
        res.send(data);
    }).catch(err => {
        console.log(err.message)
    })
};

// (28. Delete Image Episode)
exports.deleteImageEpisodes = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;
    const epsId = req.params.episode_id;
    const imgId = req.params.images_id;

    Page.findAll({
        include: [
            {
                model: Episodes,
                as: "episodeID",
                where: { webtoon_id: webtoonId, id: epsId },
                attributes: [],
                include: [
                    {
                        model: Webtoon,
                        as: "webtoonID",
                        where: { created_by: userId, id: webtoonId },
                        attributes: []
                    }
                ]
            }
        ]
    }).then(items => {
        if (items.length > 0) {
            Page.destroy({
                where: { episode_id: epsId, id: imgId }
            }).then(deleted => {
                res.send({
                    Message: "Delete Succesfull !!"
                });
            });
        }
    });
};

// (27. Create Image Episode)
exports.createImageEpisodes = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;
    const epsId = req.params.episode_id;

    Episode.findAll({
        include: [
            {
                model: Webtoon,
                as: "webtoonID",
                where: { created_by: userId, id: webtoonId }
            }
        ],
        where: { id: epsId }
    }).then(items => {
        if (items.length > 0 && req.body.episode_id == epsId) {
            Page.create({
                episode_id: req.body.episode_id,
                page: req.body.page,
                image: req.body.image
            }).then(data => {
                res.send(data);
            });
        } else {
            res.send({
                Message: "Error request !!"
            });
        }
    });
};

// (26. Delete My Episode)
exports.deleteMyEpisodes = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;
    const epsId = req.params.episode_id;

    Webtoon.findAll({
        where: { created_by: userId, id: webtoonId }
    }).then(data => {
        Episode.destroy({
            where: { webtoon_id: webtoonId, id: epsId }
        }).then(deleted => {
            res.send({
                Message: "delete succesfull"
            });
        });
    });
};

// (25. Update My Episode)
exports.updateMyEpisodes = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;
    const epsId = req.params.episode_id;

    Webtoon.findAll({
        where: { created_by: userId, id: webtoonId }
    })
        .then(data => {
            Episode.update(
                {
                    episode: req.body.episode,
                    image: req.body.image
                },
                {
                    where: { webtoon_id: webtoonId, id: epsId }
                }
            ).then(data => {
                res.send({
                    Message: "Update Succesfull !!"
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// (24. Show Images Episode)
exports.showImagesEpisodes = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;
    const epsId = req.params.episode_id;

    Page.findAll({
        include: [
            {
                model: Episode,
                as: "episodeID",
                where: { webtoon_id: webtoonId, id: epsId },
                attributes: [],
                include: [
                    {
                        model: Webtoon,
                        as: "webtoonID",
                        where: { created_by: userId, id: webtoonId },
                        attributes: []
                    }
                ]
            }
        ],
        attributes: ["image"]
    }).then(data => {
        res.send(data);
    });
};

// (24. Create My Episode)
exports.createEpisodeWebtoon = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;

    Webtoon.findAll({
        where: { created_by: userId, id: webtoonId },
    }).then(items => {
        if (items.length > 0 && req.body.webtoon_id == webtoonId) {
            Episode.create({
                webtoon_id: req.body.webtoon_id,
                title: req.body.episode,
                image: req.body.image
            }).then(data => {
                res.send(data);
            });
        } else {
            res.send({
                Message: "Error request !!"
            });
        }
    });
};

// (23. Delete My Webtoon)
exports.deleteWebtoon = (req, res) => {
    const userId = req.params.user_id;
    const webtoonId = req.params.webtoon_id;

    Webtoon.destroy({
        where: { created_by: userId, id: webtoonId }
    })
        .then(data => {
            res.send({
                delete: "success"
            });
        })
        .catch(err => {
            console.log(err);
        });
};

// (22. Update My Webtoon Creation)
exports.updateMyWebtoons = (req, res) => {
    const userId = req.params.user_id
    const webtoonId = req.params.webtoon_id

    Webtoon.update(
        {
            title: req.body.title,
            genre: req.body.genre,
            image: req.body.image
        },
        {
            where: { created_by: userId, id: webtoonId }
        }
    ).then(data => {
        res.send({
            error: true,
            Message: "Try Again Later !"
        })
    })
}

// Post Create My Webtoons Creation (21.Create_My_Webtoon_Implementation)
exports.postCreateMyWebtoons = (req, res) => {
    const user_id = req.params.user_id;
    const newData = {
        title: req.body.title,
        genre: req.body.genre,
        isFavorite: req.body.isFavorite,
        image: req.body.image,
        created_by: user_id
    };
    //Webtoon.create(newData).then(data => res.send(data))
    Webtoon.create(newData).then(data => res.send(data));
}

// Get Create My Webtoons Creation (21.Create_My_Webtoon_Implementation)
exports.getCreateMyWebtoons = (req, res) => {
    const userId = req.params.user_id
    const webtoonsId = req.params.webtoon_id

    Episode.findAll({
        include: [
            {
                model: Webtoon,
                as: "webtoonID",
                where: { created_by: userId, id: webtoonsId },
                attributes: {
                    exclude: [
                        "id", "title", "genre", "image", "created_by", "createdAt", "updatedAt"
                    ]
                }
            }
        ],
    }).then(data => {
        res.send(data);
    });
};

// Get Create Webtoons (20.My_Webtoon_Creation_Implementation)
exports.getCreateWebtoons = (req, res) => {
    const user_id = req.params.user_id

    Webtoon.findAll({
        attributes: { exclude: ["created_by"] },
        where: {
            created_by: user_id
        }

    }).then(data => {
        res.send(data)
    })
}

// Episode (Webtoon) (16.Detail_Webtoon_Implementattion)
exports.getEpisode = (req, res) => {
    Episode.findAll({
        where: {
            webtoon_id: req.params.id
        }
    }).then(episodes => res.send(episodes))
}

// Page (Detail Webtoon) (17.Detail_Episode_Implementation)
exports.getPage = (req, res) => {
    Page.findAll({
        include: [
            {
                model: Episode,
                as: "episodeID",
                where: { webtoon_id: req.params.webtoon_id, id: req.params.episode_id },
                attributes: {
                    exclude: ["id", "title", "image", "webtoon_id", "createdAt", "updatedAt"]
                }
            }
        ],
        attributes: { exclude: ["id", "episode_id"] }
    }).then(pages => res.send(pages))
}

// Get
exports.show = (req, res) => {
    Webtoon.findOne({ id: req.params.id }).then(webtoon => res.send(webtoon))
}

// Post
exports.store = (req, res) => {
    Webtoon.create(req.body).then(webtoon => {
        res.send({
            message: "success",
            webtoon
        })
    })
}

// Update
exports.update = (req, res) => {
    Webtoon.update(
        req.body,
        { where: { id: req.params.id } }
    ).then(webtoon => {
        res.send({
            message: "success",
            webtoon
        })
    })
}

// Delete
exports.delete = (req, res) => {
    Webtoon.destroy({ where: { id: req.params.id } }).then(webtoon => {
        res.send({
            message: "success",
            webtoon
        })
    })
}