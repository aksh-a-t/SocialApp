const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
const Route = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const otpGenerator = require('otp-generator');
const sgMail = require('@sendgrid/mail');
const otpTemplate = require('../Mail/otpTemplate');
const { v4: uuidv4 } = require('uuid');
const forgotTemplate = require("../Mail/forgotTemplate");
sgMail.setApiKey(process.env.MAIL_API_KEY);

Route.post(
  "/register",
  [
    body("userName").notEmpty().withMessage("Name required"),
    body("email").notEmpty().withMessage("Email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      let { userName, email, password } = request.body;
      let user = await User.findOne({ email });
      let checkName = await User.findOne({userName});
      if (user && checkName) {
        return response
          .status(422)
          .json({ errors: { msg: "Email And UserName Already Exists" } });
      }
      else if(checkName){
        return response.status(422).json({errors:{msg:"UserName Already Exists"}});
      }
      else if(user){
        return response.status(422).json({errors:{msg:"Email Already Exists"}});
      }
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      let avatarType=['identicon','monsterid','wavatar','retro','robohash'];
      let avatarRandom=Math.floor(Math.random()*5);
      var avatar = gravatar.url(email, {s: '200', r: 'pg', d: avatarType[avatarRandom]});

      let otp=otpGenerator.generate(6, { digits:true,upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
      const msg={
        to: email,
        from: 'akshat0518.cse19@chitkara.edu.in', // Use the email address or domain you verified above
        subject: 'Sending the one time password from Social Media App',
        html: otpTemplate(userName,otp),
      }
      await sgMail.send(msg);
      let otpLink=uuidv4();
      let otpexpire = Date.now();
      user = new User({ userName, email, password,avatar,otp,otpLink,otpexpire});
      await user.save();
      response.status(201).json({link:otpLink});
    } catch (error) {
      console.log("Err:" + error);
      response.status(400).json({error});
    }
  }
);

Route.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = request.body;
      let user = await User.findOne({email});
      if(!user){
        return response.status(401).json({errors:{msg:"Invalid Credentials"}});
      }
      let verify = await bcrypt.compare(password , user.password);
      if(!verify){
        return response.status(401).json({errors:{msg:"Invalid Credentials"}});
      }
      const token = jwt.sign({_id:user._id},process.env.SECRET_ACCESS_KEY,{expiresIn:'6h'});
      return response.status(200).json({msg:"successful",token,avatar:user.avatar});
    } catch (error) {
      console.log("Error", error);
      response.status(400).json({error});
    }
  }
);

Route.get('/check/otplink/:uuid',async(req,res)=>{
  try{
    const data = await User.findOne({otpLink:req.params.uuid});
    if(!data){
      return res.sendStatus(401);
    }else
      return res.sendStatus(200);
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})

Route.post('/check/otp/:uuid',async(req,res)=>{
  try{
    if(!req.body.otp){
      return res.status(400).json("OTP required");
    }
    const data = await User.findOne({otpLink:req.params.uuid});
    if(!data){
      return res.sendStatus(401);
    }
    let time=Date.now();
    let dbtime=new Date(data.otpexpire).getTime()+1*60*60*1000;
    if(data.otp==req.body.otp&&time<=dbtime){
      data.otp=null;
      data.otpexpire=null;
      data.otpLink=null;
      await data.save();
      return res.status(200).json("Verified");//delete otp ->link time
    }
    res.sendStatus(401);
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})
Route.post('/get/forgotlink',async(req,res)=>{
  try{
    if(!req.body.email){
      return res.status(422).json("email required");
    }
    const data=await User.findOne({email:req.body.email});
    if(!data){
      return res.sendStatus(404);
    }
    let forgotLink=uuidv4();
    let forgotexpire=Date.now();
    data.forgotexpire=forgotexpire;
    data.forgotLink=forgotLink;
    await data.save();
    const msg={
      to: req.body.email,
      from: 'akshat0518.cse19@chitkara.edu.in', // Use the email address or domain you verified above
      subject: 'Sending the link to change your password from Social Media App',
      html: forgotTemplate(data.userName,forgotLink),
    }
    await sgMail.send(msg);
    res.sendStatus(200);

  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})
Route.get('/check/forgotlink/:uuid',async(req,res)=>{
  try{
    const data = await User.findOne({forgotLink:req.params.uuid});
    if(!data){
     return res.sendStatus(401);
    }
    else
      res.sendStatus(200);
  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})
Route.put('/change/password/:uuid',async(req,res)=>{
  try{
    if(!req.body.password){
      return res.status(422).json("Enter Valid Password");
    }
    let {password} =req.body;
    let data = await User.findOne({forgotLink:req.params.uuid});
    if(!data){
      return res.sendStatus(401);
    }
    let time=Date.now();
    let dbtime=new Date(data.forgotexpire).getTime()+1*60*60*1000;;
    if(time<=dbtime){
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      data.password=password;
      data.forgotLink=null;
      data.forgotexpire=null;
      await data.save();
      res.status(202).json("updated");
    }
    else{
      data.forgotLink=null;
      data.forgotexpire=null;
      await data.save();
      res.sendStatus(401);
    }
}catch(e){
    console.log(e);
    res.sendStatus(500);
  }
})
module.exports = Route;
