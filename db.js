const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webtoon-express'
})

connection.connect()

module.exports = connection