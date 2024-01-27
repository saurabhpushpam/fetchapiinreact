const post = require('../models/postModel')
const path = require("path");

const createPost = async (req, res) => {
  try {

    const posts = new post({
      phone: req.body.phone,
      title: req.body.title,
      date: req.body.date,
      image: req.file.filename

    });

    posts.save();

    res.status(400).send({ success: true, msg: "post data", data: posts });

  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

const update_post = async (req, res) => {
  try {

    const phone = req.body.phone;
    const title = req.body.title;
    const newdate = req.body.date;
    const newimage = req.file.filename;

    const data = await post.findOne({ phone: phone });

    if (data) {
      const id = data.id;
      const userData = await post.findByIdAndUpdate({ _id: id }, {
        $set: {
          title: title,
          date: newdate,
          image: newimage
        }
      });

      res.status(200).send({ success: true, msg: "your data has been updated" });

    } else {
      res.status(200).send({ success: false, msg: "User id not found!" });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}


// delete data
const deletepost = async (req, res) => {
  try {

    const ph = req.body.phone;

    const data = await post.findOne({ phone: ph });
    if (data) {
      const id = data._id;
      const userData = await post.deleteOne({ _id: id });

      res.status(200).send({ success: true, msg: "your data has been deleted" });

    } else {
      res.status(200).send({ success: false, msg: "invalid phone number" });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}


// get all data
const getpost = async (req, res) => {

  try {

    const data = await post.find();
    const formattedData = data.map(item => ({

      id: item._id,
      phone: item.phone,
      title: item.title,
      date: item.date,
      image: item.image,

      //   imagePath: path.join(__dirname, '..', 'public/productImages', item.images) // Construct complete local image path

    }));

    // Send the formatted data as the response
    // res.status(200).json(formattedData);

    res.status(200).send({ success: true, msg: "All details :", data: formattedData });

  } catch (error) {
    res.status(400).send(error.message);
  }

}


// get data by id
const getdetailbyid = async (req, res) => {
  try {

    // const id = req.body.id;
    const id = req.params.id;

    const data = await post.findOne({ _id: id });

    if (data) {

      /*
                 const getImagePath = (imageName) => {
                     // Construct the path to the image in the 'public/images' directory
                     const imagePath = path.join(__dirname, '..', 'public', 'productImages', imageName);
                     return imagePath;
                 };
     
                 const imageName = data.images;
                 const imagePath = getImagePath(imageName);
                 const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
     
                 const responseData = {
                     id: data._id,
                     title: data.title,
                     description: data.description,
                     price: data.price,
                     images: data.images,
                     imagePath: imagePath,
                   //  image_Base64: `data:image/png;base64, ${imageBase64}`
                 };
     
                 res.json(responseData);
     */

      //     const imageName = data.images;
      //     const imagePath = path.join(__dirname, '..', 'public/productImages', imageName);
      res.status(200).send({ success: true, msg: " details :", data: { data } });

    } else {
      res.status(200).send({ success: false, msg: "id not found!" });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}


// get image by imagename

const getimagebyname = async (req, res) => {
  try {

    const image = req.params.image;


    const getImagePath = (imageName) => {
      // Construct the path to the image in the 'public/images' directory
      const imagePath = path.join(__dirname, '..', 'public', 'postImages', imageName);
      return imagePath;
    };

    const imageName = image;
    const imagePath = getImagePath(imageName);
    res.sendFile(imagePath);


  } catch (error) {
    res.status(400).send(error.message);
  }
}

// get image by id
const getimagebyid = async (req, res) => {
  try {

    const id = req.params.id;
    // const id = req.body.id;

    const data = await post.findOne({ _id: id });
    if (data) {
      const image = data.image;


      const getImagePath = (imageName) => {
        // Construct the path to the image in the 'public/images' directory
        const imagePath = path.join(__dirname, '..', 'public', 'postImages', imageName);
        return imagePath;
      };


      const imageName = image;
      const imagePath = getImagePath(imageName);
      res.sendFile(imagePath);
    } else {
      res.status(200).send({ success: false, msg: "id not found!" });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}



module.exports = {
  createPost,
  update_post,
  deletepost,
  getpost,
  getdetailbyid,
  getimagebyname,
  getimagebyid
}