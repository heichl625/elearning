'use strict'

const Models = use('App/Controllers/Http/ModelController')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)
const nodemailer = require("nodemailer");
const Configs = use('App/Controllers/Http/ConfigController');

class CourseController {

    async getCourses({ request, response }) {

        let keywords = request.input('keywords') || '';
        let category = request.input('category') || '';
        let sortby = request.input('sortby') || '';
        let instructor = request.input('instructor') || '';
        let type = request.input('type') || '';

        let courseArr = [];

        let courses = await Models.Course.getCourses(keywords, category, sortby, instructor, type);

        for (const course of courses) {
            let total_student = await Models.CourseEnrollment
                .query()
                .where('course_id', course.id)
                .getCount();

            courseArr.push({
                ...course,
                id: hashids.encode(course.id),
                total_student: total_student
            })
        }

        if (sortby === 'topselling') {
            courseArr.sort((a, b) => b.total_student - a.total_student)
        }


        let instructorInfo;

        if (instructor) {
            instructorInfo = await Models.Tutor.find(instructor);
        }


        return response.json({
            courses: courseArr,
            instructor: instructorInfo?.name
        })

    }

    async getCourse({ params, response }) {

        let id = hashids.decode(params.id)[0]

        let course = await Models.Course
            .query()
            .where('id', id)
            .where('deleted_at', null)
            .first();

        course.id = hashids.encode(course.id)

        let tutor;

        if (course) {
            tutor = await Models.Tutor
                .query()
                .where('id', course.tutor_id)
                .where('deleted_at', null)
                .first()
        }


        let student_number = await Models.CourseEnrollment
            .query()
            .where('course_id', id)
            .getCount();

        let lesson_number = await Models.Lesson
            .query()
            .where('course_id', id)
            .getCount()

        return response.json({ course, tutor, student_number, lesson_number })

    }

    async getCourseLessons({ params, response }) {

        let lessonList = [];

        let id = hashids.decode(params.id)[0]

        let lessons = await Models.Lesson
            .query()
            .where('course_id', id)
            .where('deleted_at', null)
            .orderBy('order')
            .fetch()

        for (const lesson of lessons.toJSON()) {

            const materials = await Models.Material
                .query()
                .where('lesson_id', lesson.id)
                .where('deleted_at', null)
                .fetch();

            lessonList.push({
                ...lesson,
                id: hashids.encode(lesson.id),
                course_id: hashids.encode(lesson.course_id),
                materials: materials.toJSON()
            })


        }

        return response.json({ lessons: lessonList })

    }

    async checkPurchase({ params, response, auth }) {

        let userAuth = auth.authenticator('user');

        let user = await userAuth.getUser();

        let id = hashids.decode(params.id)[0];

        let record = await Models.CourseEnrollment
            .query()
            .where('course_id', id)
            .where('user_id', user.id)
            .where('deleted_at', null)
            .first()


        let isPurchased = false

        if (record.toJSON()) {
            isPurchased = true
        }

        return response.json({ isPurchased: isPurchased })

    }

    async getCartCategories({ request, response }) {

        let { cart } = request.all();
        let categories = [];

        for (let i = 0; i < cart.length; i++) {
            let course_id = hashids.decode(cart[i].course_id)[0]
            let tmpCategories = await Models.CourseCategory.getCourseCategories(course_id);
            tmpCategories.forEach(cat => {
                if (!categories.find(category => category.id === cat.id)) {
                    categories.push(cat)
                }
            })
        }

        return response.json({ categories: categories });

    }

    async getComments({ params, response }) {

        let { id } = params

        id = hashids.decode(id)[0]

        let comments = await Models.Comment.getComments(id)

        return response.json({ comments: comments })

    }

    async postComments({ request, response, auth }) {

        let userAuth = auth.authenticator('user');
        let user = await userAuth.getUser();

        let { course_id, rating, comment } = request.all();

        course_id = hashids.decode(course_id)[0]
        let course = await Models.Course.find(course_id);

        try {
            let newComment = new Models.Comment();

            newComment.course_id = course_id;
            newComment.user_id = user.id;
            newComment.rating = rating;
            newComment.comment = comment;
            newComment.status = 'pending'

            await newComment.save();

            //Send Email notification
            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: process.env.NODE_ENV === 'production' ? 'melearn@enrichculture.com' : 'leo.lo@innopage.com',
                subject: `[No reply]MeLearn.Guru：有新評價需要審批`,
                html: Configs.Email.template.newCommentNotification(user.email, course.title, rating, comment),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })

            let comments = await Models.Comment
                .query()
                .where('status', 'show')
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .fetch()

            comments = comments.toJSON().map(comment => ({
                ...comment,
                course_id: hashids.encode(comment.course_id)
            }))

            return response.json({ comment: comments })
        } catch (err) {
            console.log(err)

            return response.json({ error: err })
        }
    }

    async getSuggestions({ request, response }) {

        let enrolledCourses = [];
        let pendingCourses = [];

        let { course_id, user_id } = request.all();

        course_id = hashids.decode(course_id)[0]

        if (user_id) {
            let courseEnrollment = await Models.CourseEnrollment
                .query()
                .where('user_id', user_id)
                .where('deleted_at', null)
                .fetch();
            enrolledCourses = courseEnrollment.toJSON().map(course =>course.course_id);

            let pendingCoursesRecords = await Models.Transaction
                .query()
                .select('transaction_details.course_id')
                .leftJoin('transaction_details', 'transactions.id', 'transaction_details.transaction_id')
                .where('transactions.user_id', user_id)
                .where(function () {
                    this
                        .where('transactions.method', 'bank-transfer')
                        .orWhere('transactions.method', 'fps')
                })
                .where('transactions.status', 'pending')
                .whereNotNull('transactions.proof')
                .whereNull('transactions.deleted_at')
                .whereNull('transaction_details.deleted_at')
                .fetch();



            pendingCourses = pendingCoursesRecords.toJSON().map(course => hashids.encode(course.course_id));

        }

        let suggestionList = []

        let currentCourse = await Models.Course
            .query()
            .where('id', course_id)
            .first()

        let currentCategory = await Models.CourseCategory
            .query()
            .where('course_id', course_id)
            .first();



        let courseFromSameInstructor = await Models.Course
            .query()
            .select('tutors.id as tutor_id', 'courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
            .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
            .where('courses.tutor_id', currentCourse.tutor_id)
            .where('courses.published', 1)
            .whereNot('courses.id', course_id)
            .whereNotNull('courses.price')
            .whereNull('courses.deleted_at')
            .whereNotIn('courses.id', [...enrolledCourses, ...pendingCourses])
            .limit(4)
            .fetch()



        for (const course of courseFromSameInstructor.toJSON()) {
            suggestionList.push(course)
        }

        if (suggestionList.length < 4) {
            let courseFromSameCategory = await Models.Course
                .query()
                .select('course_categories.id as course_category_id', 'courses.*', 'tutors.avator as tutor_avator', 'tutors.name as tutor_name')
                .leftJoin('course_categories', 'courses.id', 'course_categories.course_id')
                .leftJoin('tutors', 'courses.tutor_id', 'tutors.id')
                .where('course_categories.category_id', currentCategory.category_id)
                .where('courses.published', 1)
                .whereNot('courses.id', course_id)
                .whereNotNull('courses.price')
                .whereNull('courses.deleted_at')
                .whereNull('course_categories.deleted_at')
                .whereNotIn('courses.id', [...enrolledCourses, ...pendingCourses])
                .limit(4)
                .fetch();

            for (const course of courseFromSameCategory.toJSON()) {
                if (!suggestionList.find(suggestion => suggestion.id === course.id) && suggestionList.length < 4) {
                    suggestionList.push(course);
                }
            }
        }


        for (const suggestion of suggestionList) {

            let total_student = await Models.CourseEnrollment
                .query()
                .where('course_id', suggestion.id)
                .whereNull('deleted_at')
                .getCount()
            suggestion.total_student = total_student;
            suggestion.id = hashids.encode(suggestion.id)

        }

        return response.json({ suggestionList: suggestionList })

    }

    async getSharedCertificates({ params, response }) {
        let { token } = params;

        try {
            let certificate = await Models.CourseEnrollment.getSharedCertificates(token);
            certificate[0].course_id = hashids.encode(certificate[0].id)
            let user = await Models.User.find(certificate[0].user_id);
            let { first_name, last_name, username } = user.toJSON();
            return response.json({ certificate: certificate[0], user: { first_name: first_name, last_name: last_name, username: username } })
        } catch (err) {
            console.log(err);
        }

    }

    async checkQuizExist({ request, response }) {

        let { course_id } = request.all();

        course_id = hashids.decode(course_id)[0];

        try {
            let quiz = await Models.QuizQuestion
                .query()
                .where('course_id', course_id)
                .whereNull('deleted_at')
                .count('* as total');

            let hasQuiz = false;

            if (quiz[0].total > 0) {
                hasQuiz = true;
            }

            return response.json({ hasQuiz: hasQuiz })
        } catch (err) {
            return response.json({ error: err.toString() })
        }



    }

}

module.exports = CourseController
