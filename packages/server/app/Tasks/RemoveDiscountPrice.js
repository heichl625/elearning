"use strict"
const Task = use('Task')
const Models = use('App/Controllers/Http/ModelController');
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')

class RemoveDiscountPrice extends Task {

    static get schedule() {
        return "41 11 * * *";
    }

    async handle() {
        try {
            await Models.Course
                .query()
                .where('discount_end', '<=', HelperFunction.DateParser.toSQLForm(new Date()))
                .whereNull('deleted_at')
                .update({
                    discount_price: null,
                    discount_text: null,
                    discount_start: null,
                    discount_end: null
                })

        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = RemoveDiscountPrice