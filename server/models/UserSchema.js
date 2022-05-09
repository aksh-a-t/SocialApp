const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar :{type:String,required:true},
    otp:{type:Number},
    otpexpire:{type:Number},
    otpLink:{type:String},
    forgotLink:{type:String},
    forgotexpire:{type:Number},
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
