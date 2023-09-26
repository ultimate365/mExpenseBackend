const UsersApp = require("../models/usersApp");
let Otp = require("../models/otp");

const delUserApp = async (req, res) => {
  let id = req.body.id;
  // res.json({ message: 'ok' })
  // console.log(id)
  try {
    let response = await UsersApp.deleteOne({ id: id });
    if (response.acknowledged) {
      res.status(200).json({ message: "ok", data: response });
    } else {
      res.status(301).json({ message: "error", data: "Something Went Wrong" });
    }
  } catch (e) {
    res.status(301).json({ message: "error", data: "Something Went Wrong" });
    console.log(e);
  }
};

const userAddApp = async (req, res) => {
  let {
    teachersID, //Added For Firebase
    id, //Added For Firebase
    username,
    email,
    name,
    desig,
    empid,
    photoName,
    url,
    pan,
    password,
  } = req.body;
  let data = await new UsersApp({
    teachersID, //Added For Firebase
    id, //Added For Firebase
    username,
    email,
    name,
    desig,
    empid,
    photoName,
    url,
    pan,
    password,
  });
  try {
    let response = await data.save();
    res.status(200).json({ message: "ok" });
  } catch (e) {
    res.status(301).json({ message: "error", data: "User Already Exists." });
  }
};

const emailSendApp = async (req, res) => {
  let rEmail = req.body.email;
  let data = await UsersApp.findOne({ email: rEmail });
  const responseType = {};
  let otpcode = Math.floor(Math.random() * 10000 + 1);
  if (data) {
    let otpdata = new Otp({
      email: req.body.email,
      code: otpcode,
      expiresIn: new Date().getTime() + 300 * 1000,
    });
    let otpResponse = await otpdata.save();
    responseType.statusText = "Success";
    // responseType.otp = otpcode
    responseType.message = "OTP Sent, Please check your Email";
    mailer(rEmail, otpcode);
  } else {
    responseType.statusText = "Error";
    responseType.message = "Email does not Exist";
  }
  res.status(200).json(responseType);
  // console.log(otpcode)
};

const forgotPasswordApp = async (req, res) => {
  let data = await Otp.findOne({
    email: req.body.email,
    code: req.body.otpCode,
  });
  // console.log(req.body.email)
  // console.log(req.body.otpCode)
  const responseType = {};
  if (data) {
    let currentTime = new Date().getTime();
    let difference = data.expiresIn - currentTime;
    if (difference < 0) {
      responseType.message = "Token Expired";
      responseType.statusText = "error";
    } else {
      let newUser = await UsersApp.findOne({ email: req.body.email });
      if (newUser) {
        newUser.password = req.body.password;
        newUser.save();
        responseType.message = "Password Changed Successfully";
        responseType.statusText = "Success";
        updmailer(req.body.email);
      }
    }
  } else {
    responseType.message = "Invalid OTP";
    responseType.statusText = "error";
  }
  res.status(200).json(responseType);
  // console.log(responseType)
};

const mail = process.env.GMAIL;
const mailpassword = process.env.GMAILPASSWORD;

const mailer = (email, otp) => {
  const nodemailer = require("nodemailer");
  var smtpTransport = require("nodemailer-smtp-transport");
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: mail,
        pass: mailpassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );
  let mailoptions = {
    from: mail,
    to: email,
    subject: `Reset your Password: Mail no ${Math.floor(
      Math.random() * 1000 + 1
    )}`,
    text: `Your OTP is ${otp}`,
  };
  transporter.sendMail(mailoptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};

const updmailer = (email) => {
  const nodemailer = require("nodemailer");
  var smtpTransport = require("nodemailer-smtp-transport");
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: mail,
        pass: mailpassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );
  let mailoptions = {
    from: mail,
    to: email,
    subject: `Password Changed Confirmation: Mail no ${Math.floor(
      Math.random() * 1000 + 1
    )}`,
    text: `Your Password Has Been Changed Successfully. If You Haven't Changed it Own, Please contact us at ${mail} `,
  };
  transporter.sendMail(mailoptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};

module.exports = {
  userAddApp,
  delUserApp,
  emailSendApp,
  forgotPasswordApp,
};
