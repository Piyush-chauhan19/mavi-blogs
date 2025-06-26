const mongoose = require('mongoose')

function connectToDB() {
    mongoose.connect(process.env.DB_CONNECT).then(() => {
        console.log("conneted to database");
    }).catch(err => {
        console.log(err);
    });
}

module.exports = connectToDB