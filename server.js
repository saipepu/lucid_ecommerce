const express = require('express');
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const Auth = require('./routes/auth')
const Category = require('./routes/category')
const Product = require('./routes/product')
const cors = require('cors')
const path = require('path')

//middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//connectin mongodb
const mongoURI = process.env.MONGODB_URL
mongoose.connect( mongoURI, { useNewUrlParser: true })
.then(() => console.log('database connected'))
.catch(err => console.log(err, 'cannot connect to database'))

//testing routes
app.get('/', (req, res) => {
  res.send('hello world!')
})
//routes
app.use('/auth', Auth)
app.use('/category', Category)
app.use('/product', Product)

app.use(express.static(path.join(__dirname, "/client_side/build")));
console.log(__dirname);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client_side/build', 'index.html'));
});
if(process.env.NODE_ENV === 'production') {
  console.log('heroku')
  app.use(express.static('../client/build'))
}

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, console.log(`server running on ${PORT}`))