import Course  from "../models/course.model.js";
import AppError from "../utilits/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

const getAllCourses = async function(req, res, next) {
    try {
   const courses = await Course.find({}).select('-lectures');

   res.status(200).json({
    success: true,
    message: 'All courses',
    courses,
   });
   } catch(e) {
    return next (
        new AppError(e.message, 500)
    )
   }
}

const getLecturesByCoursesId = async function (req, res, next) {
    try {
       const { id } = req.params;
       console.log('Courses Id >',id);
    
       const course = await Course.findById(id);
       console.log('Course Detail >',course);
       if (!course) {
        return next (
            new AppError('Invalis course id', 400)
        )
       }

       res.status(200).json({
        success: true,
        message: 'Course lectures fetched successfully',
        lectures: course.lectures
       });
    } catch (e) {
        return next (
            new AppError(e.message, 500)
        )
    }
}

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(
            new AppError('All filed are required', 400)
        )
    }
    
    const course = await Course.create({
        title,
        description,
        category,
        createBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_url: 'Dummy'
        },
    });
    
    if(!course) {
        return next(
            new AppError('Course could not be created, please try again', 500)
        )
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.uploda(req.file.path, {
                floder: 'lms'
            });
            console.log(JSON.stringify(result));
            if (result) {
                course.thumbnail.public_id = result.public_id ;
                course.thumbnail.secure_url = result.secure_url ;
            }
            fs.rm(`uploads/${req.file.filename}`);
        } catch(e) {
            return next(
                new AppError(e.message, 500)
            )
        }     
    }

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course created successfully',
        course,
    });
}

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        );

        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }
        res.status(200).json({
            success: true,
            message: 'Course updated successfully!',
            course
        })
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })
        
    } catch(e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

const addLectureToCourseId = async (rea, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
    
        if (!title || !description) {
            return next(
                new AppError('All filed are required', 400)
            )
        }
    
        const course = await Course.findById(id);
    
        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }
        
        const lectureData = {
            title,
            description,
            lecture: {}
        };
    
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.uploda(req.file.path, {
                    floder: 'lms'
                });
                console.log(JSON.stringify(result));
                if (result) {
                    lectureData.lecture.public_id = result.public_id ;
                    lectureData.lecture.secure_url = result.secure_url ;
                }
                fs.rm(`uploads/${req.file.filename}`);
            } catch(e) {
                return next(
                    new AppError(e.message, 500)
                )
            }     
        }
        
        console.log('lecture> ',JSON.stringify(lectureData));
        course.lectures.push(lectureData);
    
        course.numberOfLectures = course.lectures.length;
    
        await course.save();
    
        res.status(200).json({
            success: true,
            message: 'Lecture successfully added to the course',
            course
        });  
    } catch(e){
        return next(
            new AppError(e.message, 500)
        )
    }
};

export {
    getAllCourses,
    getLecturesByCoursesId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseId
}