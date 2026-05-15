// for starting server
// for configuring server

// requiring dotenv for using values of variables which are declared in .env file
require('dotenv').config();

const app = require('./src/app')
const connectToDB = require('./src/config/database');

// calling fn for connecting sever to DB
connectToDB();

// server is listening at port 300
app.listen(3000, () => {
    console.log('Server is listening at port 3000')
})

