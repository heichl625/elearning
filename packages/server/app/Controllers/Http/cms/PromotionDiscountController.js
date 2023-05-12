'use strict'
const Models = use('App/Controllers/Http/ModelController')
const Helpers = use('Helpers')
const HelperFunction = use('App/Controllers/Http/HelperFunctionController')

class PromotionDiscountController {

    async index({request, session, response, view}){

        let promotion = await Models.PromotionDiscount.getCurrentPromo();

        let now = new Date();
        let coupons = await Models.Coupon
            .query()
            .where('deleted_at', null)
            .where('start_on', '<=', now.toISOString())
            .where('expiry_on', '>', now.toISOString())
            .fetch();

        if(promotion){
            return view.render('promotiondiscount', {promotion: promotion[0]})
        }else{
            return view.render('pages/promotiondiscount/edit', {coupons: coupons.toJSON()})
        }
        
    }

    async getEdit({view}){
        let promotion = await Models.PromotionDiscount.getCurrentPromo();

        let now = new Date();
        let coupons = await Models.Coupon
            .query()
            .where('deleted_at', null)
            .where('start_on', '<=', HelperFunction.DateParser.toSQLForm(now))
            .where('expiry_on', '>', HelperFunction.DateParser.toSQLForm(now))
            .fetch();

        return view.render('pages/promotiondiscount/edit', { promotion: promotion[0], coupons: coupons.toJSON()})
        
    }

    async update({ request, session, response}){

        let { title, description, coupon_id } = request.all();

        const promo_img = request.file('promo_img', {
            type: ['image'],
            size: '5mb'
        });

        if(promo_img){
            await promo_img.move(Helpers.publicPath('uploads/promotion'), {
                name: `promotion_${new Date().getTime()}.${promo_img.subtype}`    
            })
    
            if(!promo_img.moved()){
                session.flash({error: '未能成功上傳推廣圖片'+promo_img.error().message})
                return response.redirect('/cms/promotion-discount')
            }
        }

        if(!coupon_id){
            session.flash({error: '未能成功修改推廣Popup: 未有選擇優惠碼'})
                return response.redirect('/cms/promotion-discount')
        }

        
        try{
            let promotion = await Models.PromotionDiscount.find(1);

            if(!promotion){
                promotion = new Models.PromotionDiscount();
            }
    
            promotion.title = title;
            promotion.description = description;
            promotion.coupon_id = coupon_id;
            if(promo_img){
                promotion.promo_img = '/uploads/promotion/' + promo_img.fileName
            }
    
            await promotion.save()
    
            session.flash({notification: '已更新推廣優惠Popup設定'})
            return response.redirect('/cms/promotion-discount')
    
        }catch(err){
            session.flash({error: '未能更新推廣優惠Popup設定：' + err})
            return response.redirect('/cms/promotion-discount')
        }

        
    }

    async clear({response, session}){

        try{
            let promotion = await Models.PromotionDiscount.find(1);
            promotion.title = null;
            promotion.description = null;
            promotion.coupon_id = null;
            promotion.promo_img = null;
            promotion.created_at = null;
            promotion.deleted_at = null;
            promotion.updated_at = null;
    
            await promotion.save()
            session.flash({notification: '成功清除推廣優惠Popup設定'})
            return response.redirect('/cms/promotion-discount')
        }catch(err){
            session.flash({error: '未能清除推廣優惠Popup設定： ' + err})
            return response.redirect('/cms/promotion-discount')
        }
        
    }

}

module.exports = PromotionDiscountController
