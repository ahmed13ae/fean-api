const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/asynError");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto=require('crypto');




const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
//creatSendtoken----------------
const createSendToken=(user,statusCode,res)=>{
  const token = signToken(user._id);
  const cookieOptions={
    expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000) ,
    httpOnly:true
  }
  if(process.env.NODE_ENV==='production')cookieOptions.secure=true;
  res.cookie('jwt',token,cookieOptions)

  user.password=undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};
//----------sign up---------------------------------
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  createSendToken(newUser,201,res);
});
//--------------------sign in-------------------------------------
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide email and password!", 400));
  }
  //check if the email and password are correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }
  //sendeing the token
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
  createSendToken(user,200,res);
});
//-------------protect end point-------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
  //chect if token exist
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  //verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user belonging to this token still exist
  const tokenUser = await User.findById(decoded.id);

  if (!tokenUser) {
    next(
      new AppError("The user belonging to this token no longer exists;", 401)
    );
  }
  //check if the password was changed after the token was issued
  if (tokenUser.passwordChanged(decoded.iat)) {
    return next(
      new AppError(
        "user have changed his password recently,please log in again!",
        401
      )
    );
  }

  req.user = tokenUser;
  next();
});
//---------------------restrict roles-------------------------------------
exports.restrict = (...roles) => {
  return (req, res, next) => {
    //roles is []
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You dont have a permission for this action!", 403)
      );
    }
    next();
  };
};
//---------------------forgot password--------------------
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //check if the email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with this email!", 404));
  }
  //create the password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //sent the reset token via email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your 
  new password to this url :${resetUrl}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: "your email reset token is valid for only 10 mins",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token send to the mail",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        `there was an error sending the email! please try again later:${error}`,
        500
      )
    );
  }
});
//--------------------reset password--------------------------------------
exports.resetPassword = catchAsync(async(req, res, next) => {
  //get the user based on the token
  const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
  //check if the token isn't expired and user exist
  if (!user) {
    return next(new AppError('Token is invalid or has Expired!',400));
  }
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //log te user in
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
  createSendToken(user,200,res);
});
//-----------------update passsword-------------------
exports.updatePassword=catchAsync(async(req,res,next)=>{
//get the user info from the protect middle ware
const user=await User.findById(req.user.id).select('+password');
//check the password the confirm password (old password)
if(!user.checkPassword(req.body.currentPassword,user.password)){
  return next(new AppError('the provided current password is not correct',401))
}
//update the password
user.password=req.body.password;
user.passwordConfirm=req.body.passwordConfirm;
await user.save();
//sign the user in
// const token = signToken(user._id);
//   res.status(200).json({
//     status: "success",
//     token,
//   });
  createSendToken(user,200,res);

});