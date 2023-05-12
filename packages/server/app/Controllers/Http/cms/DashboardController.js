'use strict'
const Models = use('App/Controllers/Http/ModelController')

class DashboardController {

    async index({view, session, response}){
        let aid = session.get('cms_aid');
        let user = await Models.AdminUser.find(aid);
        if(user.role === 'tutor'){
            return response.redirect('/cms/inbox')
        }else if(user.role === 'course_developer'){
            return response.redirect('/cms/courses')
        }else{
            return view.render('/home')
        }
    }

    async getRevenue({request, response}){
        let xUnit = request.input('by') || '';
        let sales;

        if(xUnit){
            sales = await Models.Transaction.getSales(xUnit);
        }
        return response.json({sales: sales});
    }

    async  getTopSellingCourse({response}){
        let courses = await Models.Transaction.getTopSellingCourse();
        return response.json({ courses: courses})
    }

    async getTopSellingInstructor({response}){
        let instructors = await Models.Transaction.getTopSellingInstructor();
        return response.json({ instructors: instructors})
    }

    async getTotalSales ({response}){
        let total_sales = await Models.Transaction.getTotalSales();
        return response.json({total_sales: `HK$${total_sales}.00`})
    }
}

module.exports = DashboardController
