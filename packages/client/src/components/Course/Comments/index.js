import React, { useState } from 'react'
import Axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setPopup, setPopupPage } from 'redux/actions/global_setting';

//styles
import CommentsStyles from './Comments.module.scss';

//images
import ratingStarLargeOn from 'images/icon/rating_star_large_on@3x.png';
import ratingStarLargeOff from 'images/icon/rating_star_large_off@3x.png';
import ratingStarSmallOn from 'images/icon/rating_star_small_on@3x.png';
import ratingStartSmallOff from 'images/icon/rating_star_small_off@3x.png';

const Comments = ({ id, comments, isEnrolled }) => {

    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submited, setSubmited] = useState(false)
    const [error, setError] = useState('')

    const user = useSelector(store => store.user);

    const handleSubmit = (e) => {
        e.preventDefault();

        setError();

        if(!rating || !newComment){
            setError('請先評分及寫下評價再提交。')
            return;
        }

        Axios.post('/api/post-comment', {
            course_id: id,
            rating: rating,
            comment: newComment
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    setSubmited(true);
                }
            })
    }

    const handleLogin = () => {

        dispatch(setPopupPage('loginOptions'))
        dispatch(setPopup(true))

    }


    return (
        <div className={CommentsStyles.container}>
            <div className={CommentsStyles.comments}>
                {comments?.length === 0 ?
                    <p className={CommentsStyles.noComments}>目前未有任何評價</p> :

                    comments?.map(comment => {
                        return (
                            <div className={CommentsStyles.commentContainer} key={uuidv4()}>
                                <div className={CommentsStyles.left}>
                                    <p className={CommentsStyles.username}>{comment.first_name} {comment.last_name}</p>
                                    <p className={CommentsStyles.date}>{new Date(comment.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className={CommentsStyles.right}>
                                    <div className={CommentsStyles.smallRatingContainer}>
                                        <img className={CommentsStyles.smallRatingIcon} src={comment.rating >= 1 ? ratingStarSmallOn : ratingStartSmallOff} alt="rating star"/>
                                        <img className={CommentsStyles.smallRatingIcon} src={comment.rating >= 2 ? ratingStarSmallOn : ratingStartSmallOff} alt="rating star"/>
                                        <img className={CommentsStyles.smallRatingIcon} src={comment.rating >= 3 ? ratingStarSmallOn : ratingStartSmallOff} alt="rating star"/>
                                        <img className={CommentsStyles.smallRatingIcon} src={comment.rating >= 4 ? ratingStarSmallOn : ratingStartSmallOff} alt="rating star"/>
                                        <img className={CommentsStyles.smallRatingIcon} src={comment.rating === 5 ? ratingStarSmallOn : ratingStartSmallOff} alt="rating star"/>
                                    </div>
                                    <p className={CommentsStyles.commentContent}>{comment.comment}</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
            {
        user.isAuth ? (isEnrolled ? <div className={CommentsStyles.writeComment}>
            <div className={CommentsStyles.top}>
                <p className={CommentsStyles.label}>您的評價</p>
                <div className={CommentsStyles.ratingContainer}>
                    <img className={CommentsStyles.ratingIcon} src={rating >= 1 ? ratingStarLargeOn : ratingStarLargeOff} onClick={() => setRating(1)} alt="rating star"/>
                    <img className={CommentsStyles.ratingIcon} src={rating >= 2 ? ratingStarLargeOn : ratingStarLargeOff} onClick={() => setRating(2)} alt="rating star"/>
                    <img className={CommentsStyles.ratingIcon} src={rating >= 3 ? ratingStarLargeOn : ratingStarLargeOff} onClick={() => setRating(3)} alt="rating star"/>
                    <img className={CommentsStyles.ratingIcon} src={rating >= 4 ? ratingStarLargeOn : ratingStarLargeOff} onClick={() => setRating(4)} alt="rating star"/>
                    <img className={CommentsStyles.ratingIcon} src={rating === 5 ? ratingStarLargeOn : ratingStarLargeOff} onClick={() => setRating(5)} alt="rating star"/>
                </div>
            </div>
            {error && <p className={CommentsStyles.error}>{error}</p>}
            {!submited && <form className={CommentsStyles.form} onSubmit={handleSubmit}>
                <textarea className={CommentsStyles.inputBox} placeholder='請輸入評價...' value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                <button className={CommentsStyles.submitBtn} type='submit'>提交評價</button>
            </form>}
            {submited && <p className={CommentsStyles.submitedText}>已成功提交評價，評價將於審批後刊登。 謝謝!</p>}

        </div> : <div className={CommentsStyles.writeComment}>
            <p className={CommentsStyles.label}>想撰寫評價？</p>
            <p className={CommentsStyles.loginText}>請先購買此課程後才撰寫評價</p>
        </div>) : <div classNam={CommentsStyles.writeComment}>
        <p className={CommentsStyles.label}>想撰寫評價？</p>
        <p className={CommentsStyles.loginText}>請先登入以撰寫您對此課程的評價</p>
        <button className={CommentsStyles.loginBtn} onClick={handleLogin}>登入</button>
    </div>
    }
        </div >
    )
}

export default Comments
