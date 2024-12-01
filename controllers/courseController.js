const e = require('express');
const Course=require('../models/courseModel');

//find all---------------------
exports.getAllCourses = async (req, res) => {
  console.log('controller reached');
  try {
    // basic filtirng
    const queryObj={...req.query}
    const excludedFields=['page','sort','limit'];
    excludedFields.forEach(el=>delete queryObj[el]);
    // advanced filtring
    let queryStr=JSON.stringify(queryObj);
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
    console.log(queryStr);
   
    let query=Course.find(JSON.parse(queryStr));
    

    // Sorting note to sort desc for price for example use -price
    //example of sort : ?sort=price => to sort price asc or use ?sort=price,rating to sort by primary price and secondary rating
    if (req.query.sort) {
      const sortBy=req.query.sort.split(',').join(' ');
      query=query.sort(sortBy);
    } else{
      query=query.sort('-createdAt');
    }

    const courses = await query; // Fetch all courses from the database
    
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};    
//Create--------------------------
exports.createCourse = async (req, res) => {

    try {
      const newCourse = await Course.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          course: newCourse,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };

  //find a single course
  exports.getCourse=async(req,res)=>{
    try {
      const course=await Course.findById(req.params.id);
      res.status(200).json({
        status:'success',
        data:{
          course
        }
      });
    } catch (error) {
      res.status(500).json({
        status:'error',
        message:error
      })
    }
  }
  //update -------------------
  exports.updateCourse=async(req,res)=>{
    try {
      const updatedCourse=await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
      });
      res.status(200).json({
        status:'success',
        data:{
          updatedCourse
        }
      })
    } catch (error) {
      res.status(500).json({
        status:'error',
        message:error
      })
    }
  }
  //delete ------------------
  exports.deleteCourse=async(req,res)=>{
    try {
      await Course.findByIdAndDelete(req.params.id)
      res.status(200).json({
        status:'success',
        message:'course deleted',
      })
    } catch (error) {
      res.status(500).json({
        status:'error',
        message:error
      })
    }
  }