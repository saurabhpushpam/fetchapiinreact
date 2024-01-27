const express = require("express");
const post_routes = express();

const bodyparser = require('body-parser');
post_routes.use(bodyparser.json());
post_routes.use(bodyparser.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');
// hm public ko static bna rhe hain qki hm us data ko client side vejna chah rhe hain
post_routes.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/postImages'), function (error, success) {
      if (error) {
        console.log(error);
      }
    })
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name, function (error, success) {
      if (error) {
        console.log(error);
      }
    })
  }
})

const upload = multer({ storage: storage });

const postcontroller = require('../controllers/postController')

post_routes.post('/insert', upload.single('image'), postcontroller.createPost);
post_routes.post('/update', upload.single('image'), postcontroller.update_post);
post_routes.post('/delete', postcontroller.deletepost);
post_routes.get('/getdata', postcontroller.getpost);
post_routes.get('/getdatabyid/:id', postcontroller.getdetailbyid);
post_routes.get('/getimagebyname/:image', postcontroller.getimagebyname);
post_routes.get('/getimagebyid/:id', postcontroller.getimagebyid);

module.exports = post_routes;