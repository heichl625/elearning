import React, { useEffect } from 'react'

import BrandStoryStyles from './BrandStory.module.scss';

//images
import top from 'images/BrandStory/top.png';
import section3 from 'images/BrandStory/section3.png';
import section4 from 'images/BrandStory/section4.png';
import section5 from 'images/BrandStory/section5.png';
import section6 from 'images/BrandStory/section6.png';
import benefit1 from 'images/BrandStory/benefits_1@3x.png';
import benefit2 from 'images/BrandStory/benefits_2@3x.png';
import benefit3 from 'images/BrandStory/benefits_3@3x.png';
import benefit4 from 'images/BrandStory/benefits_4@3x.png';
import tick from 'images/icon/tick_white@3x.png';
import close from 'images/icon/close_white@3x.png';

const BrandStory = () => {

    useEffect(() => {
        document.title = '品牌故事 - MeLearn.Guru'

    }, [])

    return (
        <div className={BrandStoryStyles.container}>
            <div className={BrandStoryStyles.section1}>
                <div className={BrandStoryStyles.branding}>
                    <div>
                        <h3 className={BrandStoryStyles.subtitle}>品牌故事</h3>
                        <h1 className={BrandStoryStyles.slogan}>在自學，自在學</h1>
                        <h1 className={BrandStoryStyles.slogan}>Chill Smart!</h1>
                    </div>

                </div>
                <img src={top} className={BrandStoryStyles.section1Img} alt="MeLearn.guru 在自學，自在學，Chill Smart!"/>

            </div>
            <div className={BrandStoryStyles.section2}>
                <div className={BrandStoryStyles.adventages}>
                    <img src={benefit1} className={BrandStoryStyles.icon} alt="具前瞻性的課程設計，解鎖最搶手的新技能！"/>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.tick} src={tick} alt="benefit icon"/>
                        <p className={BrandStoryStyles.benefitText}>具前瞻性的課程設計，解鎖最搶手的新技能！</p>
                    </div>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.close} src={close} alt="traditional disavantage icon"/>
                        <p className={BrandStoryStyles.avoidText}>只有單一專長</p>
                    </div>
                </div>
                <div className={BrandStoryStyles.adventages}>
                    <img src={benefit2} className={BrandStoryStyles.icon} alt="課程結合實戰和知識，讓你輕鬆上手！"/>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.tick} src={tick} alt="benefit icon"/>
                        <p className={BrandStoryStyles.benefitText}>課程結合實戰和知識，讓你輕鬆上手！</p>
                    </div>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.close} src={close} alt="traditional disavantage icon"/>
                        <p className={BrandStoryStyles.benefitText}>網上學習只流於基礎</p>
                    </div>
                </div>
                <div className={BrandStoryStyles.adventages}>
                    <img src={benefit3} className={BrandStoryStyles.icon} alt="強大導師開課，以智慧領航！"/>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.tick} src={tick}  alt="benefit icon"/>
                        <p className={BrandStoryStyles.benefitText}>強大導師開課，以智慧領航！</p>
                    </div>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.close} src={close} alt="traditional disavantage icon"/>
                        <p className={BrandStoryStyles.benefitText}>網上教師良莠不齊</p>
                    </div>
                </div>
                <div className={BrandStoryStyles.adventages}>
                    <img src={benefit4} className={BrandStoryStyles.icon} alt="18分鐘內上完一課，自由自在遲成學習目標！"/>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.tick} src={tick} alt="benefit icon"/>
                        <p className={BrandStoryStyles.benefitText}>18分鐘內上完一課，自由自在達成學習目標！</p>
                    </div>
                    <div className={BrandStoryStyles.iconDesc}>
                        <img className={BrandStoryStyles.close} src={close} alt="traditional disavantage icon"/>
                        <p className={BrandStoryStyles.benefitText}>沒有能安靜學習的長時間</p>
                    </div>
                </div>

            </div>
            <div className={BrandStoryStyles.section3}>
                <div className={BrandStoryStyles.leftText}>
                    <div className={BrandStoryStyles.sectionTitleContainer}>
                        <h3>一點接通達人</h3>
                        <h3>掌握新世代必備的才智！</h3>
                    </div>
                    <p className={BrandStoryStyles.sectionContent}>MeLearn.guru（自在學）創立於2020年，為天窗文化集團旗下的多元網上學習平台，匯聚各界達人，提供你最需要的、最深入的未來技能和智慧。世界變得太快，學校所教的知識早已不夠用。</p>
                    <p className={BrandStoryStyles.sectionContent}>MeLearn.guru匯聚財金界、新經濟、商管等專才及達人，錄製短片傳授新時代的實戰才智；無論是投資理財、數碼技能、企管營銷領域的知識及智慧，你都可以按著自己步調，悠遊地與我們一起學習及精通，輕鬆踏上青雲路，向財務自由之王道大步邁進！</p>
                </div>
                <img src={section3} className={BrandStoryStyles.rightImg} alt="MeLearn.guru（自在學）為天窗文化集團旗下的多元網上學習平台"/>
            </div>
            <div className={BrandStoryStyles.section4}>
                <img src={section4} className={BrandStoryStyles.leftImg} alt="MeLearn.guru的課程均以達人的實戰經驗為主"/>
                <div className={BrandStoryStyles.rightText}>
                    <h3 className={BrandStoryStyles.sectionTitle}>以實戰洞悉未來趨勢</h3>
                    <p className={BrandStoryStyles.sectionContent}>MeLearn.guru的課程均以達人的實戰經驗為主，其中包括投資系統闡釋、活用期權策略、簡易Excel程式交易、Python入門等課程，助你在短時間掌握智慧精髓，在新時代洞悉先機。</p>
                </div>
            </div>
            <div className={BrandStoryStyles.section5}>
                <div className={BrandStoryStyles.leftText}>
                    <h3 className={BrandStoryStyles.sectionTitle}>聽最好的導師講課</h3>
                    <p className={BrandStoryStyles.sectionContent}>MeLearn.guru雲集各界別的精英導師，包括財經暢銷書作者龔成、知名期權操盤手金曹，其資歷和成就均有保證。再透過MeLearn.guru小組深度挖掘，為大家帶來一系列實用與知識齊備的課程。就讓頂尖導師以智慧領航，帶領我們向智慧前進。</p>
                </div>
                <img src={section5} className={BrandStoryStyles.rightImg} alt="MeLearn.guru雲集各界別的精英導師，如龔成、金曹等"/>
            </div>
            <div className={BrandStoryStyles.section6}>
                <img src={section6} className={BrandStoryStyles.leftImg} alt="MeLearn.guru的課程可以在限時內無限重溫，學習時間、進度由你自行決定"/>
                <div className={BrandStoryStyles.rightText}>
                    <h3 className={BrandStoryStyles.sectionTitle}>自由自在的學習體驗</h3>
                    <p className={BrandStoryStyles.sectionContent}>MeLearn.guru的課程可以在限時內無限重溫，學習時間、進度由你自行決定。同學在遇到疑難或不明白的地方，更可以透過平台向導師提問，形成雙向、互動的學習體驗。只要一機在手，就能自在學習，依自己的步伐前進，為自己的財富和人生增值。</p>
                </div>

            </div>
        </div>

    )
}

export default BrandStory
