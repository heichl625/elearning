'use strict'
const STRIPE_SK = require('../app/Utils/StripeToken'); 

// const UserController = require('../app/Controllers/Http/UserController');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('/', '/cms/DashboardController.index').middleware('adminauth')
    Route.on('/login').render('login')

    //home
    Route.get('/dashboard/get-revenue', '/cms/DashboardController.getRevenue').middleware('adminauth', 'admin');
    Route.get('/dashboard/get-top-selling', '/cms/DashboardController.getTopSellingCourse').middleware('adminauth', 'admin');
    Route.get('/dashboard/get-top-selling-instructor', '/cms/DashboardController.getTopSellingInstructor').middleware('adminauth', 'admin');
    Route.get('/dashboard/get-total-sales', '/cms/DashboardController.getTotalSales').middleware('adminauth', 'admin');


    //Courses
    Route.get('/courses', 'cms/CourseController.index').middleware('adminauth', 'course_developer');
    Route.get('/courses/edit/:id', 'cms/CourseController.getEdit').middleware('adminauth', 'course_developer');
    Route.get('/courses/add', 'cms/CourseController.getAdd').middleware('adminauth', 'course_developer');
    Route.post('/courses/add', 'cms/CourseController.add').middleware('adminauth', 'course_developer');
    Route.post('/courses/edit/:id', 'cms/CourseController.edit').middleware('adminauth', 'course_developer');
    Route.get('/courses/delete/:id', 'cms/CourseController.delete').middleware('adminauth', 'course_developer');
    Route.get('/courses/:course_id/quiz', 'cms/CourseController.quizIndex').middleware('adminauth', 'course_developer');
    Route.post('/courses/:course_id/add-quiz-question', 'cms/CourseController.addQuizQuestion').middleware('adminauth','course_developer');
    Route.get('/courses/:course_id/quiz/:question_id/edit', 'cms/CourseController.editQuestionIndex').middleware('adminauth', 'course_developer');
    Route.post('/courses/:course_id/quiz/:question_id/edit', 'cms/CourseController.editQuestion').middleware('adminauth', 'course_developer');
    Route.get('/courses/:course_id/quiz/:question_id/delete', 'cms/CourseController.deleteQuestion').middleware('adminauth', 'course_developer');

    
    //Materials
    Route.post('/materials/delete', 'cms/MaterialController.delete').middleware('adminauth', 'course_developer');
    Route.post('/materials/deleteOld', 'cms/MaterialController.deleteOld').middleware('adminauth', 'course_developer');
    Route.post('/materials', 'cms/MaterialController.upload').middleware('adminauth', 'course_developer');
    
    //Lessons
    Route.get('/lessons', 'cms/LessonController.index').middleware('adminauth', 'course_developer');
    Route.get('/courses/:id/lessons', 'cms/LessonController.indexByCourse').middleware('adminauth', 'course_developer');
    Route.get('/lessons/add', 'cms/LessonController.addView').middleware('adminauth', 'course_developer');
    Route.post('/lessons/add', 'cms/LessonController.add').middleware('adminauth', 'course_developer');
    Route.get('/lessons/edit/:id', 'cms/LessonController.getEdit').middleware('adminauth', 'course_developer');
    Route.post('/lessons/edit/:id', 'cms/LessonController.edit').middleware('adminauth', 'course_developer');
    Route.get('/courses/:course_id/delete/:lesson_id', 'cms/LessonController.delete').middleware('adminauth', 'course_developer');

    //Comments
    Route.get('/comments', 'cms/CommentController.index').middleware('adminauth', 'admin');
    Route.get('/get-pending-comments-number', 'cms/CommentController.getPendingCommentsNumber').middleware('adminauth', 'admin');
    Route.get('/comments/:id', 'cms/CommentController.getCommentById').middleware('adminauth', 'admin');
    Route.get('/comments/:id/change-status/:status', 'cms/CommentController.changeStatus').middleware('adminauth', 'admin');
    Route.post('/comments/:id/delete', 'cms/CommentController.delete').middleware('adminauth', 'admin');
    
    //Course Categories
    Route.get('/category', 'cms/CategoryController.index').middleware('adminauth');
    Route.on('/category/add').render('pages/category/add').middleware('adminauth');
    Route.post('/category/add', 'cms/CategoryController.add').middleware('adminauth');
    Route.get('/category/:id', 'cms/CategoryController.getCourses').middleware('adminauth');
    Route.get('/category/edit/:id', 'cms/CategoryController.getEdit').middleware('adminauth');
    Route.post('/category/edit/:id', 'cms/CategoryController.edit').middleware('adminauth');
    Route.get('/category/delete/:id', 'cms/CategoryController.delete').middleware('adminauth');

    //Coupons
    Route.get('/coupons', 'cms/CouponController.index').middleware('adminauth', 'admin')
    Route.get('/coupons/edit/:id', 'cms/CouponController.getEdit').middleware('adminauth', 'admin')
    Route.on('/coupons/add').render('pages/coupons/add').middleware('adminauth', 'admin')
    Route.post('/coupons/add', 'cms/CouponController.add').middleware('adminauth', 'admin')
    Route.post('/coupons/edit/:id', 'cms/CouponController.edit').middleware('adminauth', 'admin')
    Route.get('/coupons/delete/:id', 'cms/CouponController.delete').middleware('adminauth', 'admin')
    
    //Instructors
    Route.get('/tutors', 'cms/TutorController.index').middleware('adminauth', 'admin')
    Route.get('/tutors/add', 'cms/TutorController.getAdd').middleware('adminauth', 'admin')
    Route.post('/tutors/add', 'cms/TutorController.add').middleware('adminauth', 'admin')
    Route.get('/tutors/edit/:id', 'cms/TutorController.getEdit').middleware('adminauth', 'admin')
    Route.post('/tutors/edit/:id', 'cms/TutorController.edit').middleware('adminauth', 'admin')
    Route.get('/tutors/delete/:id', 'cms/TutorController.delete').middleware('adminauth', 'admin')
    Route.get('/tutors/:id/inbox', 'cms/TutorController.tutorInbox').middleware('adminauth', 'admin');
    
    //Course Developers
    Route.get('/course_developers', 'cms/CourseDeveloperController.index').middleware('adminauth', 'admin')
    Route.on('/course_developers/add').render('pages/coursedevelopers/add').middleware('adminauth', 'admin')
    Route.post('/course_developers/add', 'cms/CourseDeveloperController.add').middleware('adminauth', 'admin')
    Route.get('/course_developers/:id/edit', 'cms/CourseDeveloperController.getEdit').middleware('adminauth', 'admin')
    Route.post('/course_developers/:id/edit', 'cms/CourseDeveloperController.edit').middleware('adminauth', 'admin')
    Route.post('/course_developers/:id/delete', 'cms/CourseDeveloperController.delete').middleware('adminauth', 'admin')
    
    //Users
    Route.get('/users', 'cms/UserController.showAllUser').middleware('adminauth', 'admin')
    Route.get('/users/:id', 'cms/UserController.getUserDetail').middleware('adminauth', 'admin')
    Route.get('/users/delete/:id', 'cms/UserController.delete').middleware('adminauth', 'admin')
    Route.get('/users/enable/:id', 'cms/UserController.enable').middleware('adminauth', 'admin')

    //Transaction Record
    Route.get('/transactions', 'cms/TransactionController.index').middleware('adminauth', 'admin')
    Route.get('/get-pending-transaction-number', 'cms/TransactionController.getPendingTransactionNumber').middleware('adminauth', 'admin');
    Route.get('/transactions/:id', 'cms/TransactionController.getTransactionDetail').middleware('adminauth', 'admin')
    Route.post('/transactions/:id/change_status', 'cms/TransactionController.changeStatus').middleware('adminauth, auth')
    
    //Admin Register & Login
    Route.get('users/:id', 'cms/AdminUserController.show').middleware('adminauth', 'admin')
    
    Route.post('/register', 'cms/AdminUserController.register')
    Route.on('/register').render('register')
    Route.post('/register-tutor', 'cms/AdminUserController.registerAdminUser')
    Route.post('/login', 'cms/AdminUserController.login')
    Route.get('/logout', 'cms/AdminUserController.logout')
    Route.post('/change-password', 'cms/AdminUserController.changePassword')

    //Frontpage
    Route.get('/frontpage', 'cms/FrontpageController.index').middleware('adminauth', 'admin')
    Route.post('/frontpage/free-trial', 'cms/FrontpageController.setFreeTrialCourses').middleware('adminauth', 'admin')
    Route.post('/upload-banner', 'cms/FrontpageController.uploadBanner').middleware('adminauth', 'admin')
    Route.post('/move-up-banner', 'cms/FrontpageController.moveUpBanner').middleware('adminauth', 'admin')
    Route.post('/move-down-banner', 'cms/FrontpageController.moveDownBanner').middleware('adminauth', 'admin')
    Route.post('/delete-banner', 'cms/FrontpageController.deleteBanner').middleware('adminauth', 'admin')
    Route.post('/add-marquee', 'cms/FrontpageController.addMarquee').middleware('adminauth', 'admin')
    Route.post('/move-up-marquee', 'cms/FrontpageController.moveUpMarquee').middleware('adminauth', 'admin')
    Route.post('/move-down-marquee', 'cms/FrontpageController.moveDownMarquee').middleware('adminauth', 'admin')
    Route.post('/delete-marquee', 'cms/FrontpageController.deleteMarquee').middleware('adminauth', 'admin')

    //Promotion Discount
    Route.get('/promotion-discount', 'cms/PromotionDiscountController.index').middleware('adminauth', 'admin')
    Route.get('/promotion-discount/edit', 'cms/PromotionDiscountController.getEdit').middleware('adminauth', 'admin')
    Route.get('/promotion-discount/clear', 'cms/PromotionDiscountController.clear').middleware('adminauth', 'admin')
    Route.post('/promotion-discount', 'cms/PromotionDiscountController.update').middleware('adminauth', 'admin')

    //Inbox
    Route.get('/inbox', '/cms/InboxController.index').middleware('instructorauth')
    Route.post('/download-file', 'cms/InboxController.downloadFile').middleware('instructorauth');
    Route.post('/tutor-send-message', 'cms/InboxController.tutorSendMessage').middleware('instructorauth');


    //Frequently asked
    Route.get('/qna', 'cms/QnaController.index').middleware('adminauth', 'admin')
    Route.get('/qna/add', 'cms/QnaController.add_form').middleware('adminauth', 'admin')
    Route.post('/qna/add', 'cms/QnaController.add').middleware('adminauth', 'admin')
    Route.get('/qna/:id/edit', 'cms/QnaController.edit_form').middleware('adminauth', 'admin')
    Route.post('/qna/:id/edit', 'cms/QnaController.edit').middleware('adminauth', 'admin')
    Route.post('/qna/:id/delete', 'cms/QnaController.delete').middleware('adminauth', 'admin')


    //Exports
    Route.get('/exports', 'cms/ExportController.index').middleware('adminauth', 'admin')
    Route.post('/exports/sales_per_day', 'cms/ExportController.sales_per_day').middleware('adminauth', 'admin')
    Route.post('/exports/sales_by_courses', 'cms/ExportController.sales_by_courses').middleware('adminauth', 'admin')
    Route.post('/exports/sales_by_instructor', 'cms/ExportController.sales_by_instructor').middleware('adminauth', 'admin')

    //Change PW
    Route.on('/change-password').render('change-password').middleware('adminauth')
    Route.post('/change-password', 'cms/AdminUserController.changePassword').middleware('adminauth')



})
.prefix('cms')


//API
Route.group(() => {

    //user
    Route.post('register', 'api/UserController.register')
    Route.post('login', 'api/UserController.login')
    Route.post('login/complete-missing-fields', 'api/UserController.completeMissingFields').middleware('userauth')
    Route.post('login/social-platform', 'api/UserController.socialPlatformLogin')
    Route.post('login/2fa', 'api/UserController.verify2fa')
    Route.post('login/resend-2fa', 'api/UserController.resend2fa')
    Route.get('logout', 'api/UserController.logout')
    Route.post('users/update', 'api/UserController.update').middleware('userauth')
    Route.get('auth', 'api/UserController.auth');
    Route.get('/get-course-developer-id', 'api/UserController.getCourseDeveloperID');
    Route.get('/user-purchase', 'api/UserController.getPurchaseRecord')
    Route.get('favourite', 'api/UserController.getFavourite').middleware('userauth')
    Route.get('get-favourite-courses', 'api/UserController.getFavourite').middleware('userauth')
    Route.post('favourite', 'api/UserController.setFavourite').middleware('userauth')
    Route.get('cart', 'api/UserController.getCart').middleware('userauth')
    Route.post('cart', 'api/UserController.updateCart').middleware('userauth')
    Route.get('enrolled-courses', 'api/UserController.getEnrolledCourses').middleware('userauth')
    Route.get('enrolled-courses-detail', 'api/UserController.getEnrolledCoursesDetail').middleware('userauth')
    Route.post('forgot-passowrd', 'api/UserController.forgotPassword')
    Route.post('reset-password', 'api/UserController.resetPassword')
    Route.post('update-old-user-phone', 'api/UserController.updateOldUserPhone')
    Route.get('transaction-number', 'api/UserController.getTransactionNumber').middleware('userauth');
    Route.post('update-user-billing-address', 'api/UserController.updateBillingAddress').middleware('userauth');
    Route.post('update-extra-user-data','api/UserController.updateExtraUserData').middleware('userauth');
    Route.get('billing-detail', 'api/UserController.getBillingDetail').middleware('userauth');
    Route.post('/check-enrolled', 'api/UserController.checkEnroll').middleware('userauth');
    Route.post('/get-last-lesson-date', 'api/UserController.getLastLessonDate').middleware('userauth');
    Route.post('/get-finished-lessons', 'api/UserController.getFinishedLessons').middleware('userauth');
    Route.post('/finish-lesson', 'api/UserController.finishLesson').middleware('userauth');
    Route.post('/get-lesson-to-start', 'api/UserController.getLessonToStart').middleware('userauth');
    Route.get('/enrolled-course-instructors', 'api/UserController.getEnrolledCourseInstructors').middleware('userauth')
    Route.get('/user-unread-messages', 'api/UserController.getUserUnreadMessages').middleware('userauth');
    Route.post('/finish-course', 'api/UserController.finishCourse').middleware('userauth');
    Route.post('/check-course-finished', 'api/UserController.checkCourseFinished').middleware('userauth');;
    Route.get('/certificates', 'api/UserController.getCertificates').middleware('userauth');
    Route.get('/get-profile', 'api/UserController.getProfile').middleware('userauth');
    Route.post('/update-profile', 'api/UserController.updateProfile').middleware('userauth');
    Route.post('/edit-phone-number', 'api/UserController.updateProfileWithPhone').middleware('userauth');
    Route.post('/update-profile-check-valid', 'api/UserController.updateProfileCheckValid').middleware('userauth');
    Route.post('/change-password', 'api/UserController.changePassword').middleware('userauth');
    Route.get('/get-billing-address', 'api/UserController.getBillingAddress').middleware('userauth');
    Route.get('/credit-card-list', 'api/UserController.getCreditCardList').middleware('userauth')
    Route.post('/remove-card', 'api/UserController.removeCard').middleware('userauth');
    Route.post('/add-card', 'api/UserController.addCard').middleware('userauth');
    Route.get('/pending-course', 'api/UserController.getPendingCourses').middleware('userauth');

    //course
    Route.get('courses', 'api/CourseController.getCourses')
    Route.get('courses/:id', 'api/CourseController.getCourse')
    Route.get('courses/:id/lessons', 'api/CourseController.getCourseLessons')
    Route.get('courses/:id/check-purchase', 'api/CourseController.checkPurchase').middleware('userauth')
    Route.post('courses/cart-categories', 'api/CourseController.getCartCategories')
    Route.post('post-comment', 'api/CourseController.postComments').middleware('userauth')
    Route.get('/courses/:id/comments', 'api/CourseController.getComments')
    Route.post('/course-suggestions', 'api/CourseController.getSuggestions')
    Route.post('/check-quiz-exist', 'api/CourseController.checkQuizExist');

    //lesson
    Route.post('download-material', 'api/LessonController.downloadMaterial')

    //quiz
    Route.post('get-questions', 'api/QuizController.getQuizQuestions').middleware('userauth');
    Route.post('save-quiz-answers', 'api/QuizController.saveQuizAnswers').middleware('userauth')
    Route.post('get-submitted-answers', 'api/QuizController.getSubmittedAnswers').middleware('userauth')

    //Categories
    Route.get('categories', 'api/CategoryController.get')

    //checkout
    Route.post('create-transaction', 'api/CheckoutController.createTransaction').middleware('userauth');
    Route.post('confirm-purchase', '/api/CheckoutController.confirmPurchase').middleware('userauth');
    Route.post('checkout/upload-proof', 'api/CheckoutController.uploadProof').middleware('userauth');
    Route.post('update-purchase', 'api/CheckoutController.updatePurchase').middleware('userauth');
    Route.post('pay-with-credit-card', 'api/CheckoutController.payWithCreditCard').middleware('userauth');
    Route.post('alipay-callback', 'api/CheckoutController.alipayCallback')
    Route.post('checkout/check-pending-transaction', 'api/CheckoutController.checkPendingTransaction').middleware('userauth');

    //Coupon
    Route.post('check-coupon', 'api/CouponController.checkCoupon').middleware('userauth');;

    //Home
    Route.get('/promotion-popup', 'api/HomeController.getPromotionPopup');
    Route.get('carousell-banner', 'api/HomeController.getBanner');
    Route.get('trial_courses', 'api/HomeController.getTrailCourses');
    Route.get('top-selling', 'api/HomeController.getTopSelling');
    Route.get('new-courses', 'api/HomeController.getNewCourses');
    Route.get('early-bird', 'api/HomeController.getEarlyBirdCourses');
    Route.post('/enquiry', 'api/HomeController.sendEnquiry');

    //Transaction
    Route.post('get-purchase-course-detail', 'api/TransactionController.getTransactionDetailById').middleware('userauth');
    Route.post('get-transaction-coupon', 'api/TransactionController.getTransactionCoupon').middleware('userauth');
    Route.post('get-transaction', 'api/TransactionController.getTransaction')
    // Route.post('get-unfinished-purchase-course-detail', 'api/TransactionController.getUnfinishedTransactionDetail')

    //Inbox
    Route.post('get-messages', 'api/InboxMessageController.userGetMessage').middleware('userauth');
    Route.post('user-send-message', 'api/InboxMessageController.sendByUser').middleware('userauth');
    Route.post('download-file', 'api/InboxMessageController.downloadFile').middleware('userauth');

    Route.get('/get-user-ip', 'api/UserController.getUserIP')
    Route.get('/get-certificates/:token', 'api/CourseController.getSharedCertificates');

    //Frequently-asked
    Route.get('/frequently-asked', 'api/AboutController.frequentlyAsked')
    


}).prefix('api')

Route.get('/static/:name(.*)', 'web/AssetController.asset');
Route.get('/media/:name(.*)', 'web/AssetController.media')
Route.get('/*', 'web/HomeController.home');

