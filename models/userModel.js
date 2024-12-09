const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "please provide an email!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email!"],
  },
  role: {
    type: String,
    enum: ["user", "provider", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please choose a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please choose a password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same!",
    },
  },
  picture: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1290864946/photo/e-learning-education-concept-learning-online.jpg?s=612x612&w=0&k=20&c=y1fQ-3wbsvdDaMn-cuHPibcgozOxKQS99mIgz6DFcVA=",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
//-------------------------middlewares---------------------------------------------------------------
userSchema.pre("save", async function (next) {
  //only run if password is changed
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save',function(next){
  if(!this.isModified('password')||this.isNew)return next();
  this.passwordChangedAt=Date.now()-1000;
  next();
})

//---------------------instance methods---------------------------------------------------------
//an instance method that will be available on all documents to check if password is correct
userSchema.methods.checkPassword = async function (
  providedPassword,
  correctPassword
) {
  return await bcrypt.compare(providedPassword, correctPassword);
};
//checkin if password changed after the token issued
userSchema.methods.passwordChanged = function (JWTTime) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTime, changeTimeStamp);
    return JWTTime < changeTimeStamp;
  }
  return false;
};
//instance method to check to send email reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    console.log({resetToken},this.passwordResetToken);
  this.passwordResetExpires=Date.now() + 10*60*1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
