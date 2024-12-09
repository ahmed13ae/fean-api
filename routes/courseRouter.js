const express=require('express');
const courseController=require('../controllers/courseController')
const authController=require('../controllers/authController')
const router=express.Router();

router.get('/',authController.protect,authController.restrict('admin','provider'),courseController.getAllCourses);
router.get('/:id',courseController.getCourse);
router.post('/',courseController.createCourse);
router.patch('/:id',courseController.updateCourse);
router.delete('/:id',authController.protect,authController.restrict('admin','provider'),courseController.deleteCourse);

module.exports=router;