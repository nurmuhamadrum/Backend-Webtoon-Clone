const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.user

// Login User (13.Login_Implementation)
exports.login = (req, res) => {
    //check if email and pass match in db tbl user
    const email = req.body.email
    const password = req.body.password //use encryption in real world case!

    User.findOne({ where: { email, password } }).then(user => {
        if (user) {
            const token = jwt.sign({ userId: user.id }, 'my-secret-key')
            res.send({
                user,
                token
            })
        } else {
            res.send({
                code: "ERR_WRONG_EMAIL_PASS",
                message: "Wrong Email or Password!"
            })
        }
    })
}

// Register User (14.Register_Implementation)
exports.register = (req, res) => {
    User.create({
        email: req.body.email,
        password: req.body.password
    }).then(user => {
        if (user) {
            const token = jwt.sign({ userId: user.id }, 'my-secret-key')
            res.send({
                status: "true",
                token
            })
        }
    })
}