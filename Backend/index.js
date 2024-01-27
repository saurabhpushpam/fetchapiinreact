const express = require('express');
const app = express();
const cors = require('cors');
// app.use(express.json());
// app.use(cors());

app.use(cors({
  origin: "*"
}));

const post_routes = require('./routes/postRoutes');
app.use('/api', post_routes)



// const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/ecomm");

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/mern_crud");

app.listen(8000, function () {
  console.log("server is running on 8000")
});
