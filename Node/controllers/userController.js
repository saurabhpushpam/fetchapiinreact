const userproduct = require("../models/productModel");
const user = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const bcryptjs = require('bcryptjs');

const config = require("../config/config");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const randomstring = require("randomstring");
const otpGenerator = require('otp-generator');


const create_token = async (id) => {

    try {

        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    }
    catch (error) {

        res.status(400).send(error.message);

    }
}

const register_user = async (req, res) => {


    try {

        const spassword = await securePassword(req.body.password);

        const users = new user({
            title: req.body.title,
            email: req.body.email,
            phone: req.body.phone,
            password: spassword,
            type: req.body.type




            // password: req.body.password,



        });



        const userData = await user.findOne({ email: req.body.email });
        if (userData) {
            res.status(200).send({ success: false, msg: "This email is already exist" });

        }
        else {
            const user_data = await users.save();
            res.status(200).send({ success: true, data: user_data });
        }

    }

    catch (error) {


        res.status(400).send(error.message);
    }
}

//login Method

const user_login = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;


        const userData = await user.findOne({ email: email });

        if (userData) {

            // compare() is a function of bcryptjs, in that function we compare 2 values
            // first value "password" which user pass at the time of login
            // and second value "userData.password" means the original password stored in database

            const passwordmatch = await bcryptjs.compare(password, userData.password);

            if (passwordmatch) {

                const tokenData = await create_token(userData._id);
                const id = await userData._id;
                const savetoken = await user.updateOne({ _id: id }, { $push: { tokens: tokenData } });


                const userResult = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone,
                    type: userData.type,
                    token: tokenData

                }

                const response = {
                    success: true,
                    msg: "User Details",
                    data: userResult
                }

                res.status(200).send(response);

            }
            else {
                res.status(200).send({ success: false, msg: "login details are incorrect" });
            }

        }
        else {
            res.status(200).send({ success: false, msg: "login details are incorrect" });
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}


const getuser = async (req, res) => {
    try {

        const data = await user.find();
        const formattedData = data.map(item => ({

            id: item._id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            password: item.password,
            type: item.type

        }));

        // Send the formatted data as the response
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const resetpassword = async (req, res) => {
    try {

        const token = req.params.token;
        //  const token= req.query.token;

        const tokenData = await user.findOne({ tokens: token });

        if (tokenData) {

            const password = req.body.password;
            //  const oldpassword = tokenData.password;

            const passwordmatch = await bcryptjs.compare(password, tokenData.password);
            if (passwordmatch) {
                const new_password = req.body.newpassword;
                const confirmpassword = req.body.confirmpassword;
                if (new_password === confirmpassword) {
                    const newpassword = await securePassword(new_password);
                    const userdata = await user.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newpassword } }, { new: true })

                    res.status(200).send({ success: true, msg: "User password has been reset", data: userdata });
                }
                else {
                    res.status(200).send({ success: true, msg: "new_password and confirm_password didn't match" });
                }
                //      const foundDocuments = await DataModel.find({ name: value });
            }
            else {
                res.status(200).send({ success: true, msg: "password is wrong" });
            }
        }

        else {
            res.status(200).send({ success: true, msg: "invalid token" });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}



const sendresetpasswordmail = async (username, email, token) => {

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOption = {
            from: config.emailUser,
            to: email,
            subject: 'For reset password',
            html: '<p> Hii ' + username + ', please click the link <a href= "https://title-74im.onrender.com/api/resetpassword"> and reset your password </a>'
        }

        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error);

            }
            else {
                console.log("Mail has been sent : ", info.response);
            }
        });



    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const forget_password = async (req, res) => {

    try {
        const email = req.body.email;
        const userData = await user.findOne({ email: email });
        if (userData) {

            const Randomstring = randomstring.generate();
            const data = await user.updateOne({ email: email }, { $set: { token: Randomstring } });
            sendresetpasswordmail(userData.name, userData.email, Randomstring);
            res.status(200).send({ success: true, msg: "Please check your inbox of email and reset your password" })

        }
        else {

            res.status(200).send({ success: true, msg: "This email does not exist" });

        }

    } catch (error) {

        res.status(200).send({ success: false, msg: error.message });

    }

}
/*
// reset password

const reset_password = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await user.findOne({ token: token });

        if (tokenData) {
            const password = req.body.password;
            const newpassword = await securePassword(password);
            const userdata = await user.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newpassword, token: '' } }, { new: true })

            res.status(200).send({ success: true, msg: "User password has been reset", data: userdata })
        } else {
            res.status(200).send({ success: true, msg: "This link is invalid" });
        }

    } catch (error) {
        res.status(200).send({ success: false, msg: error.message });
    }
}
*/


// this will open reset.ejs file on browser
const emailforgot = async (req, res) => {
    try {
        res.render('reset');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetuser = async (req, res) => {
    try {

        const email = req.body.email;

        const userdata = await user.findOne({ email: email })
        if (!userdata) {
            res.render('reset', { message: " invalid email" });
        }



        else {

            // const password = req.body.password;

            // const passwordmatch = await bcryptjs.compare(password, userdata.password);
            //  if (passwordmatch) {


            const newpassword = req.body.newpassword;
            const confirmpassword = req.body.confirmpassword;


            if (newpassword === confirmpassword) {


                const newpswd = await securePassword(newpassword);
                const userd = await user.findByIdAndUpdate({ _id: userdata._id }, { $set: { password: newpswd } }, { new: true })

                res.render('data', { message: " your password has been reset successfully" });
                // res.status(200).send({ success: true, msg: "User password has been reset", data: userdata });


            }


            else {

                res.render('reset', { message: " new password and confirm password did not match" });

            }
            //   }
            // else {

            //     res.render('reset', { message: "old password is wrong " });

            // }
        }

    } catch (error) {
        res.render('reset', { message: error.message });

        //console.log(error.message);
    }
}



/*
const fogetuser = async (req, res) => {
    try {

        const spassword = await securepassword(req.body.password);

        const user = new userregister({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
            is_admin: 0

        });

        const userdata = await user.save();

        if (userdata) {
            res.render('data', { message: " your password has been reset successfully " });

        }
        else {
            res.render('reset', { message: " your reset password has been failed" });
        }

    } catch (error) {
        console.log(error.message);
    }
}
*/



// logout from all device 
const logout = async (req, res) => {
    try {

        const token = req.params.token;
        //  const token= req.query.token;

        const tokenData = await user.findOne({ tokens: token });

        if (tokenData) {


            const newtoken = [];
            const userdata = await user.findByIdAndUpdate({ _id: tokenData._id }, { $set: { tokens: newtoken } }, { new: true })

            res.status(200).send({ success: true, msg: "Logout Successfully" });
        }
        else {
            res.status(200).send({ success: true, msg: "Invalid token" });
        }
        //      const foundDocuments = await DataModel.find({ name: value });
    }


    catch (error) {
        res.status(400).send(error.message);
    }
}


// logout from 1(current) device
const logoutone = async (req, res) => {
    try {

        const token = req.params.token;
        //  const token= req.query.token;

        const tokenData = await user.findOne({ tokens: token });

        if (tokenData) {

            // const elementToDelete = 3;
            const mytoken = tokenData.tokens;

            // Use the filter method to exclude the element you want to delete.
            const newArray = mytoken.filter((item) => item !== token);
            //   const newtoken= [];
            const userdata = await user.findByIdAndUpdate({ _id: tokenData._id }, { $set: { tokens: newArray } }, { new: true })

            res.status(200).send({ success: true, msg: "Logout Successfully" });
        }
        else {
            res.status(200).send({ success: true, msg: "Invalid token" });
        }
        //      const foundDocuments = await DataModel.find({ name: value });
    }


    catch (error) {
        res.status(400).send(error.message);
    }
}


const sendotp = async (username, email, token, otp) => {

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOption = {
            from: config.emailUser,
            to: email,
            subject: 'For reset password',
            html: '<p> Hii ' + username + ', otp to reset your password is ' + otp + '</p>'
        }

        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error);

            }
            else {
                console.log("Mail has been sent : ", info.response);
            }
        });



    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const generateotp = async (req, res) => {


    try {
        const email = req.body.email;
        const userData = await user.findOne({ email: email });
        if (userData) {

            // generate 4 digit random number
            const min = 1000; // Minimum 4-digit number (inclusive)
            const max = 9999; // Maximum 4-digit number (inclusive)
            const randomno = Math.floor(Math.random() * (max - min + 1)) + min;

            // Generate a 6-digit numeric OTP
            const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });

            const uid = userData._id;
            //console.log(uid);
            // const userdata = await user.UpdateOne({ email: email }, { $set: { otp: otp } });
            const userdata = await user.findByIdAndUpdate({ _id: uid }, { $set: { otp: otp } }, { new: true })

            const Randomstring = randomstring.generate();
            const data = await user.updateOne({ email: email }, { $set: { token: Randomstring } });
            sendotp(userData.name, userData.email, Randomstring, otp);
            res.status(200).send({ success: true, msg: "Please check your inbox of email and reset your password" })

        }
        else {

            res.status(200).send({ success: true, msg: "This email does not exist" });

        }

    } catch (error) {

        res.status(200).send({ success: false, msg: error.message });

    }

}


const resetpasswordbyotp = async (req, res) => {
    try {

        const token = req.params.token;

        //  const token= req.query.token;

        const tokenData = await user.findOne({ tokens: token });

        if (tokenData) {

            const otp = req.body.otp
            const dbotp = tokenData.otp;
            //  const password = req.body.password;
            //  const oldpassword = tokenData.password;

            //   const passwordmatch = await bcryptjs.compare(password, tokenData.password);
            if (otp == otp) {
                const new_password = req.body.newpassword;
                const confirmpassword = req.body.confirmpassword;
                if (new_password === confirmpassword) {
                    const newpassword = await securePassword(new_password);
                    const userdata = await user.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: newpassword, otp: "" } }, { new: true })

                    res.status(200).send({ success: true, msg: "User password has been reset", data: userdata });
                }
                else {
                    res.status(200).send({ success: true, msg: "new_password and confirm_password didn't match" });
                }
                //      const foundDocuments = await DataModel.find({ name: value });
            }
            else {
                res.status(200).send({ success: true, msg: "password is wrong" });
            }
        }

        else {
            res.status(200).send({ success: true, msg: "invalid token" });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports = {

    register_user,
    user_login,
    getuser,
    forget_password,
    //reset_password,
    emailforgot,
    forgetuser,
    resetpassword,
    logout,
    logoutone,
    generateotp,
    resetpasswordbyotp


}