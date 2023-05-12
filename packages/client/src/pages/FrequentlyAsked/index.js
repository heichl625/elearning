import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

import FrequentlyAskedStyles from './FrequentlyAsked.module.scss';

//images
import arrowUp from 'images/icon/arrow_up_blue@3x.png';
import arrowDown from 'images/icon/arrow_down_blue@3x.png';
import facebook from 'images/icon/social_media_facebook@3x.png';
import whatsapp from 'images/icon/social_media_whatsapp@3x.png';
import numberApp from 'images/icon/number@3x.png';

const FrquentlyAsked = () => {

    const [questions, setQuestions] = useState([]);

    useEffect(() => {

        document.title = '常見問題 - MeLearn.Guru';
        Axios.get('/api/frequently-asked')
            .then(res => res.data)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    if (data.questions) {
                        setQuestions(data.questions.map(question => ({
                            ...question,
                            active: false
                        })))
                    }
                }
            })

    }, [])

    useEffect(() => {

        console.log(questions)

    }, [questions])

    const [activeSection, setActiveSection] = useState({
        [1]: false,
        [2]: false,
        [3]: false,
        [4]: false,
        [5]: false,
        [6]: false,
        [7]: false
    })

    const handleClicked = (index) => {



        setQuestions(prev => {
            let arr = [...prev];
            arr[index] = {
                ...arr[index],
                active: !arr[index].active
            }
            return arr;
        })
    }

    return (
        <div className={FrequentlyAskedStyles.container}>
            <h3 className={FrequentlyAskedStyles.pageTitle}>常見問題</h3>
            <div className={FrequentlyAskedStyles.questionContainer}>
                {questions.map((question, index) => {
                    return <div className={FrequentlyAskedStyles.sectionContainer} key={uuidv4()}>
                        <div className={FrequentlyAskedStyles.sectionTab} onClick={() => handleClicked(index)}>
                            <p className={FrequentlyAskedStyles.sectionTitle}>{index + 1}. {question.question}</p>
                            <img src={question.active ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                        </div>
                        {question.active && <div className={FrequentlyAskedStyles.answer} dangerouslySetInnerHTML={{ __html: question.answer }}></div>}
                    </div>
                })}

                {/* <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [2]: !prev[2] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>2. 從何得知課程的開始日期？</p>
                    <img src={activeSection[2] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[2] && <div className={FrequentlyAskedStyles.answer}>
                    <p>除了顯示狀態為「稍後公佈」的課程外，其他課程均已開放。學員付費後可無限重溫課程，並沒有時間限制。</p>
                </div>}
                <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [3]: !prev[3] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>3. 怎樣取得課程優惠？</p>
                    <img src={activeSection[3] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[3] && <div className={FrequentlyAskedStyles.answer}>
                    <p>所有優惠均於MeLearn.guru網站、Facebook及其關聯公司「天窗」平台下公佈，敬請留意。</p>
                    <p>龔成的網上課程《大富翁致富藍圖》正式開課，於2021年1月31日或之前成功購買可以限時優惠價HK$788報讀。</p>
                </div>}
                <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [4]: !prev[4] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>4. 為何登入帳戶，需要接收OTP（一次性密碼）？</p>
                    <img src={activeSection[4] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[4] && <div className={FrequentlyAskedStyles.answer}>
                    <p>為保障閣下帳戶安全，閣下登入MeLearn.guru時，將會收到一個會由MeLearn.guru發送的手機短訊，短訊包含OTP。您可於已登記的流動電話號碼查收OTP短訊，輸入後便完成登入程序。</p>
                    <p>為確保OTP可以準確發出，註冊時請務必填寫電話區號，如香港地區請填寫 +852，否則閣下未能登入MeLearn.guru網站。</p>
                </div>}
                <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [5]: !prev[5] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>5. 我怎樣能取得課程附件？</p>
                    <img src={activeSection[5] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[5] && <div className={FrequentlyAskedStyles.answer}>
                    <p>閣下可於有關課程短片的下方找到檔案下載鏈結。</p>
                </div>}
                <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [6]: !prev[6] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>6. 我在iPhone／iPad開啟Excel課程附件失敗了，有什麼解決方法？</p>
                    <img src={activeSection[6] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[6] && <div className={FrequentlyAskedStyles.answer}>
                    <p>閣下可使用iOS預設應用程式Numbers開啟課程附件。</p>
                    <img src={numberApp} className={FrequentlyAskedStyles.numberAppImg} alt="iOS Number App Icon" />
                </div>}
                <div className={FrequentlyAskedStyles.sectionTab} onClick={() => setActiveSection(prev => ({ ...prev, [7]: !prev[7] }))}>
                    <p className={FrequentlyAskedStyles.sectionTitle}>7. 除了信用卡（Visa、MasterCard、AE美國運通）外，我可使用哪些付款方式購買課程？</p>
                    <img src={activeSection[7] ? arrowUp : arrowDown} className={FrequentlyAskedStyles.indicator} alt="show/hide button" />
                </div>
                {activeSection[7] && <div className={FrequentlyAskedStyles.answer}>
                    <p>其他付款方式：</p>
                    <ol>
                        <li>銀行轉賬至香港恆生銀行戶口：347-485195-883 (Enrich Digital Limited)</li>
                        <li>透過轉數快編號 (FPS ID) 付款：166572818 (Enrich Publishing Limited)</li>
                    </ol>
                    <p>轉帳後請將入數證明連同用戶名稱、註冊電郵及登記電話，WhatsApp至(+852) 9547 2211。我們於辦公時間內（星期一至五 上午9:00 – 下午6:00）確認款項後便會將用戶添加到相關課程。</p>
                </div>} */}

                <p className={FrequentlyAskedStyles.msg}>如有其他問題，歡迎透過聯絡我們或以下平台聯繫MeLearn.guru</p>
                <div className={FrequentlyAskedStyles.socialGroup}>
                    <a href='https://www.facebook.com/melearn.guru' target='_blank'><img src={facebook} className={FrequentlyAskedStyles.mediaIcon} alt="Facebook Icon" /></a>
                    <a href='https://wa.me/85295472211' target='_blank'><img src={whatsapp} className={FrequentlyAskedStyles.mediaIcon} alt="Whatsapp Icon" /></a>
                </div>


            </div>


        </div>
    )
}

export default FrquentlyAsked
