const e = require("express");
const Course = require("../models/courseModel");
const ApiFeatures = require("./../utils/apiFeatures");
//erro handling
const catchAsync=require('./../utils/asynError');
const AppError=require('./../utils/appError')

//find all---------------------


exports.getAllCourses = async (req, res) => {
  
  try {
    let query=Course.find();
    const features=new ApiFeatures(query,req.query).filter().sort().limitFields().paginate();

    const courses = await features.dbQuery; // Fetch all courses from the database

    res.status(200).json({
      status: "success",
      results: courses.length,
      page:features.page,
      
      data: {
        courses,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

//Create--------------------------
exports.createCourse =catchAsync(async (req, res,next) => {

  const newCourse = await Course.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      course: newCourse,
    },
  });

}) 

//find a single course
exports.getCourse = catchAsync(async (req, res,next) => {
  
    const course = await Course.findById(req.params.id);
    if (!course) {
      next(new AppError('no course found with this id',404))
    }
    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  
});
//update -------------------
exports.updateCourse = catchAsync(async (req, res,next) => {
  
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCourse) {
      next(new AppError('no course found with this id',404))
    }
    res.status(200).json({
      status: "success",
      data: {
        updatedCourse,
      },
    });
  
});
//delete ------------------
exports.deleteCourse = catchAsync(async (req, res) => {
  
  const deletedCourse=  await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      next(new AppError('no course found with this id',404))
    }
    
    res.status(200).json({
      status: "success",
      message: "course deleted",
    });
 
   
  
});
