const express = require('express')
const bodyParser = require('body-parser')
require('express-group-routes')

const app = express()
const port = 5000

app.use(bodyParser.json())

//controllers
const AuthController = require('./controllers/auth')
const WebtoonsController = require('./controllers/webtoons')

//middlewares
const { authenticated, authorized } = require('./middleware')

app.group("/api/v1", (router) => {

    //auth API
    router.post('/login', AuthController.login)
    router.post('/register', AuthController.register)

    //Webtoon API

    router.get('/webtoon/:id', WebtoonsController.show)
    router.post('/webtoon', authenticated, WebtoonsController.store)
    router.patch('/webtoon/:id', authenticated, WebtoonsController.update)
    router.delete('/webtoon/:id', authenticated, WebtoonsController.delete)

    //another APIs goes here

    router.get('/webtoon/:id/episodes', WebtoonsController.getEpisode)
    //router.get
    router.get('/webtoon/:webtoon_id/episode/:episode_id/', WebtoonsController.getPage)
    //router.get('/webtoons', WebtoonsController.index)  //Webtoon Favorite
    router.get("/webtoons", WebtoonsController.getAllWebtoons)
    //Create Webtoons
    router.get("/user/:user_id/webtoons", authenticated, authorized, WebtoonsController.getCreateWebtoons)
    //Post Create My Webtoon
    router.post("/user/:user_id/webtoon", authenticated, authorized, WebtoonsController.postCreateMyWebtoons)
    // Get All Episode of a created Webtoons
    router.get("/user/:user_id/webtoon/:webtoon_id/episodes", authenticated, authorized, WebtoonsController.getCreateMyWebtoons)
    // Update My Webtoon Creation
    router.put("/user/:user_id/webtoon/:webtoon_id/", authenticated, authorized, WebtoonsController.updateMyWebtoons)
    // Delete My Webtoon
    router.delete("/user/:user_id/webtoon/:webtoon_id", authenticated, authorized, WebtoonsController.deleteWebtoon)
    // Post Create My Episode
    router.post("/user/:user_id/webtoon/:webtoon_id/episodes", authenticated, authorized, WebtoonsController.createEpisodeWebtoon)
    // Get Images Episode
    router.get("/user/:user_id/webtoon/:webtoon_id/episode/:episode_id/images", authenticated, authorized, WebtoonsController.showImagesEpisodes)
    // Update My Episode
    router.put("/user/:user_id/webtoon/:webtoon_id/episode/:episode_id/", authenticated, authorized, WebtoonsController.updateMyEpisodes)
    // Delete My Episode
    router.delete("/user/:user_id/webtoon/:webtoon_id/episode/:episode_id/", authenticated, authorized, WebtoonsController.deleteMyEpisodes)
    // Create Image For Episode
    router.post("/user/:user_id/webtoon/:webtoon_id/episode/:episode_id/image", authenticated, authorized, WebtoonsController.createImageEpisodes)
    // Delete Image 
    router.delete("/user/:user_id/webtoon/:webtoon_id/episode/:episode_id/image/:image_id", authenticated, authorized, WebtoonsController.deleteImageEpisodes)
    // Get User Favorite
    router.get("/user/:user_id/webtoon/favorites", authenticated, authorized, WebtoonsController.getFavorites)
    // Post User Favorite
    router.post("/user/:user_id/webtoon/:webtoon_id/favorites", authenticated, authorized, WebtoonsController.postFavorites)
    // Delete User Favorite
    router.delete("/user/:user_id/webtoon/:webtoon_id/favorites", authenticated, authorized, WebtoonsController.deleteFavorites)

})

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            message: "You're Unauthorized"
        })
    } else {
        next(err)
    }
})


app.listen(port, () => console.log(`Listening on port ${port}!`))