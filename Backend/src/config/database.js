const mongoose = require('mongoose')

async function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then( (res) => {
        console.log('Connected to DB');
    })
}

module.exports = connectToDB;