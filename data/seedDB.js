const fs=require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Course=require('../models/courseModel');

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose.connect(DB).then((con) => {
  console.log("connected to db");
});

const courses=JSON.parse(fs.readFileSync(`${__dirname}/courses.json`,'utf-8'));
//seeding-------------------
const seedDB=async()=>{
    try {
        await Course.create(courses)
        console.log('seeded successfully');
        process.exit();
    } catch (error) {
        console.log(`error:${error}`)
    }
}

//clearing data --------------------
const clearDB=async()=>{
    try {
        await Course.deleteMany()
        console.log('cleared successfully')
        process.exit();
    } catch (error) {
        console.log(`error:${error}`)
    }
}

if (process.argv[2]==='--seed') {
    seedDB();
}else if (process.argv[2]==='--clear') {
    clearDB();
} 