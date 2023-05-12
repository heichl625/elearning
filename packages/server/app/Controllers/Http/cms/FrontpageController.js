'use strict'
const Helpers = use('Helpers')
const Models = use('App/Controllers/Http/ModelController')

const fs = require('fs')
const { setegid } = require('process')

class FrontpageController {

    async index({ response, view }) {

        let banners = await Models.Banner
            .query()
            .orderBy('order')
            .fetch()

        let courseList = await Models.Course
            .query()
            .where('deleted_at', null)
            .where('published', 1)
            .fetch();

        let trialCourseList = await Models.TrialCourse.find(1)

        return view.render('frontpage', { banners: banners.toJSON(), courseList: courseList.toJSON(), trialCourseList: trialCourseList });

    }

    async uploadBanner({ request, response, session }) {

        let { linked_url } = request.all()

        let newBanner = request.file('banner', {
            type: ['image'],
            size: '5mb'
        })

        if(!newBanner){
            session.flash({error: "你未有選擇Banner圖片"});
            return response.redirect('/cms/frontpage')
        }

        await newBanner.move(Helpers.publicPath('uploads/banners'), {
            name: `banner_${new Date().getTime()}_`+ newBanner.clientName
        })
        if (!newBanner.moved()) {
            session.flash({error: '未能成功上載Banner: ' + newBanner.error().message})
            return response.redirect('/cms/frontpage')
        } else {

            let bannerNumber = await Models.Banner.getCount();

            let bannerItem = new Models.Banner();
            bannerItem.linked_url = linked_url;
            bannerItem.order = bannerNumber + 1;
            bannerItem.image_url = `uploads/banners/${newBanner.fileName}`
            await bannerItem.save()
        }

        return response.redirect('/cms/frontpage')
    }

    async moveUpBanner({ request, response, session }) {

        let { id } = request.all();

        let banner = await Models.Banner.find(id);

        if (banner.order === 1) {
            session.flash({ error: '此Banner已在最前的順序' })
            return response.redirect('/cms/frontpage');
        }

        let orginalOrder = banner.order;
        let prevBanner = await Models.Banner.findBy('order', banner.order - 1);
        banner.order = prevBanner.order;
        prevBanner.order = orginalOrder;

        await banner.save();
        await prevBanner.save();

        return response.redirect('/cms/frontpage');

    }

    async moveDownBanner({ request, response, session }) {

        let { id } = request.all();

        let banner = await Models.Banner.find(id);

        let bannerCount = await Models.Banner.getCount();

        if (banner.order === bannerCount) {
            session.flash({ error: '此Banner已在最後的順序' })
            return response.redirect('/cms/frontpage');
        }

        let orginalOrder = banner.order;
        let nextBanner = await Models.Banner.findBy('order', banner.order + 1);
        banner.order = nextBanner.order;
        nextBanner.order = orginalOrder;

        await banner.save();
        await nextBanner.save();

        return response.redirect('/cms/frontpage');

    }

    async deleteBanner({request, response, session}){

        let { id } = request.all();

        let banner = await Models.Banner.find(id);
        let bannerCount = await Models.Banner.getCount();
        let order = banner.order;

        await banner.delete()
        fs.unlink(`./public/${banner.image_url}`, err => {
            if(err){
                console.log(err);
                session.flash({notification: '未能刪除Banner'})
            }
        })

        for(let i = order+1; i <=bannerCount; i++){

            let bannerMoveup = await Models.Banner.findBy('order', i);
            bannerMoveup.order = bannerMoveup.order-1;
            await bannerMoveup.save()

        }

        session.flash({notification: 'Banner已被刪除'})
        return response.redirect('/cms/frontpage')

    }

    async addMarquee({request, response}){

        let { marquee } = request.all();

        let marqueeCount = await Models.Marquee.getCount();

        let newMarquee = new Models.Marquee();

        newMarquee.text = marquee;
        newMarquee.order = marqueeCount+1;

        await newMarquee.save()
        return response.redirect('/cms/frontpage')
    }

    async moveUpMarquee({request, response, session}){

        let { id } = request.all();

        let marquee = await Models.Marquee.find(id);
        
        if(marquee.order === 1){
            session.flash({error: '此走馬燈文字已在最前的順序'})
            return response.redirect('/cms/frontpage')
        }

        let prevMarquee = await Models.Marquee.findBy('order', marquee.order-1)

        let originalOrder = marquee.order;

        marquee.order = prevMarquee.order;
        prevMarquee.order = originalOrder;

        await marquee.save();
        await prevMarquee.save();

        return response.redirect('/cms/frontpage')

    }

    async moveDownMarquee({request, response, session}){

        let { id } = request.all();

        let marquee = await Models.Marquee.find(id);
        let totalMarquee = await Models.Marquee.getCount();
        
        if(marquee.order === totalMarquee){
            session.flash({error: '此走馬燈文字已在最後的順序'})
            return response.redirect('/cms/frontpage')
        }

        let nextMarquee = await Models.Marquee.findBy('order', marquee.order+1)

        let originalOrder = marquee.order;

        marquee.order = nextMarquee.order;
        nextMarquee.order = originalOrder;

        await marquee.save();
        await nextMarquee.save();

        return response.redirect('/cms/frontpage')

    }

    async deleteMarquee({request, response, session}){

        let { id } = request.all();

        let marquee = await Models.Marquee.find(id);
        let totalMarquee = await Models.Marquee.getCount();
        let order = marquee.order;

        try{
            await marquee.delete();
            for(let i = order+1; i <= totalMarquee; i++){

                let marqueeMoveup = await Models.Marquee.findBy('order', i);
                marqueeMoveup.order = marqueeMoveup.order-1;
                await marqueeMoveup.save();
    
            }
            session.flash({notification: '成功刪除走馬燈文字'})
            return response.redirect('/cms/frontpage')
        }catch(err){
            console.log(err);
            session.flash({error: '未能刪除走馬燈文字，請重試'})
            return response.redirect('/cms/frontpage')
        }
    }

    async setFreeTrialCourses({request, response, session}){

        let { course1, course2, course3 } = request.all();

        try{
            let trialCourses = await Models.TrialCourse.find(1);

            if(trialCourses){
                trialCourses.course1 = course1;
                trialCourses.course2 = course2;
                trialCourses.course3 = course3;
            }else{
                trialCourses = new Models.TrialCourse();
                trialCourses.course1 = course1;
                trialCourses.course2 = course2;
                trialCourses.course3 = course3;
            }
    
            await trialCourses.save()
            session.flash({notification: '成功更改免費試看課程'})
            return response.redirect('/cms/frontpage');
        }catch(err){
            session.flash({error: '未能更改免費試看課程: '+ err})
            return response.redirect('/cms/frontpage');
        }

        



    }

}

module.exports = FrontpageController
