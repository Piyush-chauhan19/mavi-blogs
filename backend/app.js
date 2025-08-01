const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const connectToDB = require('./db');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./routes/user.routes')
const blogRoutes = require('./routes/blog.routes')
connectToDB()

app.use('/profilePictures', express.static('profilePictures'));
app.use('/coverPictures', express.static('coverPictures'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req,res) =>{
    res.send('Hello world');
});

app.use('/user', userRoutes);
app.use('/blog', blogRoutes)

module.exports = app
