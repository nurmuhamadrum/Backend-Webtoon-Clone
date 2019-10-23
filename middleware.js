const jwt = require('express-jwt')

exports.authenticated = jwt({ secret: 'my-secret-key' })

exports.authorized = (req, res, next) => {
    if (req.user.usedId != req.params.user_id) {
        res.status(401).json({
            message: "You're Unauthorized"
        })
    } else {
        next()
    }
}