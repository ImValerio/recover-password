const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.connect(process.env.DB_URL,
    (err) => {
        if (err) {
            console.log(err)
        }
        console.log('Connected to DB')
    })



