const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const connectToDB = require('./db');
const app = express();
const userRoutes = require('./routes/user.routes')
connectToDB()


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res) =>{
    res.send('Hello world');
});

app.use('/user', userRoutes);

module.exports = app
