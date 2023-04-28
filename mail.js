var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'keerthisekharkandukuri@gmail.com',
    pass: 'rroxmtrerkbpypxs'
  }
});
const express = require('express');
const app = express();

var mailOptions = {
  from: 'keerthisekharkandukuri@gmail.com',
  to: 'kr732041@gmail.com',
  subject: 'Sending Email using Node.js',
  html: '<form action='/' method="post"><label>Enter whether to allow a person or not</label><input type="text" name="msg"></form>'
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } 
  else {
    console.log('Email sent: ' + info.response);
  }
});
app.post('/',function(req,res){
  console.log("req.body.msg")
})
