const User = require("./../models/userModel");
const catchAsync = require("./../utils/asynError");
const AppError = require("./../utils/appError");

const filterObj=(obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if (allowedFields.includes(el)) newObj[el]=obj[el];    
    });
    return newObj;
}
//------------------update user data by user---------------------
exports.updateUser=catchAsync(async(req,res,next)=>{
    //1 check if trying to update password and give him direction for the password update route
    if (req.body.password||req.body.passwordConfirm) {
        return next(new AppError('you are trying to update the password please goto : /updatePassword !'),400)   
    }
    //get the uuser and update his data using find byid and update to bypass save() reqs
    const filteredBody=filterObj(req.body,'name','email')
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    });
});
