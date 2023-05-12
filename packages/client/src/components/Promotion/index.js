import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

//styles
import PromotionStyles from './Promotion.module.scss';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { setPopup } from 'redux/actions/global_setting';

const Promotion = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const promotion = useSelector(store => store.global_setting.promotion);
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        let input = document.createElement('textarea');
        input.value = promotion?.code;
        document.body.appendChild(input)
        input.select();
        document.execCommand('copy');
        setCopied(true);
        document.body.removeChild(input);
    }

    useEffect(() => {


        const hideCopyText = () => {
            setCopied(false);
        }

        if(copied){
            let timeFunction = window.setTimeout(hideCopyText, 5000);

            return () => {
                window.clearTimeout(timeFunction);
            }
        }

    }, [copied])

    const selectCourse = () => {
        dispatch(setPopup(false));
        history.push('/courses')
    }

    return (
        <div className={PromotionStyles.container}>
            <p className={`${PromotionStyles.copiedText} ${copied ? PromotionStyles.show : PromotionStyles.hide}`}>已複製優惠碼</p>
            <img src={promotion?.promo_img} className={PromotionStyles.promoImg} alt={`${promotion?.title} cover image`}/>
            <div className={PromotionStyles.promoInfo}>
                <h2 className={PromotionStyles.title}>{promotion?.title}</h2>
                <p className={PromotionStyles.msg}>{promotion?.description}</p>
                <div className={PromotionStyles.codeContainer}>
                    <h3 className={PromotionStyles.code}>{promotion?.code}</h3>
                </div>
                <div className={PromotionStyles.buttonContainer}>
                    <button className={PromotionStyles.copyBtn} onClick={copyCode}>複製優惠碼</button>
                    <button className={PromotionStyles.selectCourseBtn} onClick={selectCourse}>立即選購課程</button>
                </div>
            </div>
        </div>
    )
}

export default Promotion
