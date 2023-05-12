'use strict'

const Models = use('App/Controllers/Http/ModelController');
const HelperFunctions = use('App/Controllers/Http/HelperFunctionController');

class CommentController {

    async index({request, view}){

        let page = request.input('request') || 1;
        let limit = request.input('limite') || 10;
        let keywords = request.input('keywords') || '';

        let comments = await Models.Comment.getAllComments(page, limit, keywords);

        comments.data.forEach(comment => {
            comment.created_at = new Date(comment.created_at).toLocaleDateString()
        })

        return view.render('comments', { comments: comments.data, lastPage: comments.lastPage, currentPage: comments.page, limit: limit });

    }

    async getPendingCommentsNumber({response}){

        let number = await Models.Comment
            .query()
            .where('status', 'pending')
            .whereNull('deleted_at')
            .getCount()

        return response.json({pendingNumber: number})

    }

    async getCommentById({ params, view}){

        let { id } = params;

        let comment = await Models.Comment.getCommentById(id);

        comment[0].created_at = new Date(comment[0].created_at).toLocaleDateString();

        return view.render('pages/comments/detail', {comment: comment[0]});

    }

    async changeStatus({params, response, session}){

        let { id, status } = params;

        try{
            let comment = await Models.Comment.find(id);

            comment.status = status;
    
            await comment.save();
    
            session.flash({notification: '成功修改評價的顯示狀態'})
        }catch(err){
            session.flash({error: '未能更改評價的顯示狀態'})
        }
        
        return response.redirect(`/cms/comments/${params.id}`)

    }

    async delete({params, response, session}){

        let { id } = params;

        try{
            let comment = await Models.Comment.find(id);
            comment.deleted_at = HelperFunctions.DateParser.toSQLForm(new Date());
            await comment.save();
            session.flash({notification: '成功刪除評價'})
            return response.redirect('/cms/comments')
        }catch(err){
            console.log(err);
            session.flash({notification: '未能成功刪除評價：' + err})
            return response.redirect('/cms/comments')
        }

    }

}

module.exports = CommentController
