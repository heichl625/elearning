'use strict'
const Models = use('App/Controllers/Http/ModelController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController');
const Configs = use('App/Controllers/Http/ConfigController');
const nodemailer = require("nodemailer");
const Helpers = use('Helpers')
const Hashids = require('hashids/cjs')
const hashids = new Hashids('', 10)

class HomeController {

    async getPromotionPopup({ response }) {

        const promotion = await Models.PromotionDiscount
            .query()
            .select('promotion_discounts.*', 'coupons.code', 'coupons.id as coupon_id')
            .leftJoin('coupons', 'promotion_discounts.coupon_id', 'coupons.id')
            .where('promotion_discounts.id', 1)
            .whereNotNull('promotion_discounts.title')
            .fetch()

        return response.json({ promotion: promotion?.toJSON()[0] });

    }

    async getBanner({ response }) {

        const banners = await Models.Banner
            .query()
            .orderBy('order')
            .fetch()
        return response.json({ banners: banners.toJSON() });

    }

    async getTrailCourses({ response }) {

        const trialCourses = await Models.TrialCourse.find(1);

        let { course1, course2, course3 } = trialCourses;

        let courses = [];

        const course1Arr = await Models.Course.getCourse(course1);
        const course2Arr = await Models.Course.getCourse(course2);
        const course3Arr = await Models.Course.getCourse(course3);

        course1Arr.length > 0 && courses.push({
            ...course1Arr[0],
            id: hashids.encode(course1Arr[0].id)
        });
        course2Arr.length > 0 && courses.push({
            ...course2Arr[0],
            id: hashids.encode(course2Arr[0].id)
        })
        course3Arr.length > 0 && courses.push({
            ...course3Arr[0],
            id: hashids.encode(course3Arr[0].id)
        })

        return response.json({ courses: courses });

    }

    async getTopSelling({ response }) {

        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        let endDate = HelperFunction.DateParser.toSQLForm(new Date());


        let coursesFetched = await Models.Course.getTopSellingCourses(HelperFunction.DateParser.toSQLForm(startDate), endDate);

        let courses = [];

        for (let i = 0; i < coursesFetched.length; i++) {
            let studentNum = await Models.Course.getStudentNumber(coursesFetched[i].id);
            courses.push({
                ...coursesFetched[i],
                total_student: studentNum
            })
        }

        for (let i = 0; i < courses.length; i++) {
            let lesson_num = await Models.Lesson
                .query()
                .where('course_id', courses[i].id)
                .whereNull('deleted_at')
                .getCount();
            courses[i].lesson_num = lesson_num
            courses[i].id = hashids.encode(courses[i].id)
        }

        return response.json({ courses: courses })
    }

    async getNewCourses({ response }) {
        const coursesFetched = await Models.Course.getNewCourses();

        let courses = [];

        for (let i = 0; i < coursesFetched.length; i++) {
            let lesson_num = await Models.Lesson
                .query()
                .where('course_id', coursesFetched[i].id)
                .whereNull('deleted_at')
                .getCount();
            let student_num = await Models.CourseEnrollment
                .query()
                .where('course_id', coursesFetched[i].id)
                .getCount();
            courses.push({
                ...coursesFetched[i],
                id: hashids.encode(coursesFetched[i].id),
                lesson_num: lesson_num,
                total_student: student_num
            })
        }

        return response.json({ courses: courses })
    }

    async getEarlyBirdCourses({ response }) {
        const coursesFetched = await Models.Course.getEarlyBirdCourses();

        let courses = [];

        for (let i = 0; i < coursesFetched.length; i++) {
            let lesson_num = await Models.Lesson
                .query()
                .where('course_id', coursesFetched[i].id)
                .whereNull('deleted_at')
                .getCount();
            let student_num = await Models.CourseEnrollment
                .query()
                .where('course_id', coursesFetched[i].id)
                .getCount();
            courses.push({
                ...coursesFetched[i],
                id: hashids.encode(coursesFetched[i].id),
                lesson_num: lesson_num,
                total_student: student_num
            })
        }

        return response.json({ courses: courses });
    }

    async sendEnquiry({ request, response }) {

        const { email, type, content } = request.all();

        console.log(process.env.ENQUIRY_EMAIL)

        try {
            let transporter = nodemailer.createTransport(Configs.Email.mailConfig);
            const info = await transporter.sendMail({
                from: '"MeLearn.Guru noreply@enrichculture.com',
                to: process.env.ENQUIRY_EMAIL,
                subject: `MeLearn.guru的查詢：${type}`,
                html: Configs.Email.template.enquiry(email, type, content),
                // attachments: [{
                //     filename: `logo_email.png`,
                //     path: __dirname + '/../../../../public/assest/logo_email_long.png',
                //     cid: 'logo'
                // }]
            })

            return response.json({ message: 'success' })

        } catch (err) {
            return response.json({ error: err })
        }

    }


}

module.exports = HomeController
