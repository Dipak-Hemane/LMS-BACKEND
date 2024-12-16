import { Router } from "express";
import { addLectureToCourseId, createCourse, getAllCourses, getLecturesByCoursesId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { authorizedRoles, authorizeSubscriber, isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/').get( getAllCourses)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
);

router.route('/:id').get(isLoggedIn, authorizeSubscriber, getLecturesByCoursesId)
.put(isLoggedIn,
    authorizedRoles('ADMIN'), 
    updateCourse
)
.delete(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    removeCourse
)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseId
);

export default router;
