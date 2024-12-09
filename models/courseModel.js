const mongoose = require("mongoose");
const slugify = require('slugify')

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A course must have a name"],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A course must have a price"],
  },
  contentText: {
    type: String, 
    trim: true,
    required: [true, "a course must provide content"],
  },
  image: {
    type: String,
    default:"https://media.istockphoto.com/id/1290864946/photo/e-learning-education-concept-learning-online.jpg?s=612x612&w=0&k=20&c=y1fQ-3wbsvdDaMn-cuHPibcgozOxKQS99mIgz6DFcVA="
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

// courseSchema.pre('save',function(next) {
//   this.slug=slugify(this.name,{lower:true});  
//   next();
// })

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
