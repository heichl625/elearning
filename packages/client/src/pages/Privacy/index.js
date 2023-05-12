import React, { useEffect } from 'react'

import PrivacyStyles from './Privacy.module.scss';

const Privacy = () => {

    useEffect(() => {

        document.title = '私隱條款 - MeLearn.Guru';

    }, [])

    return (
        <div className={PrivacyStyles.container}>
            <h2 className={PrivacyStyles.pageTitle}>收集個人資料聲明</h2>
            <div className={PrivacyStyles.content}>
                <p className={PrivacyStyles.desc}>本網站由天窗文化集團及其關聯公司（以下總稱為"本公司"）擁有和運作。閣下使用本網站之各類服務均受此私隱政策聲明列載的條款所規管。</p>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>關於私隱政策聲明</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        此私隱政策聲明將提供有關該公司透過本網站或其他途徑收集、使用和披露閣下經所提供資料（包括個人資料）的守則。在使用或提供任何資料（包括閣下之個人資料）前，請小心閱讀此私隱政策聲明的全文。
                    </p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>閣下之授權同意</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        每當閣下嘗試透過本網站或其他途徑提供個人資料時，閣下將被視作同意此私隱政策聲明之條款及同意根據有關的規定進行資料收集、使用和披露。
                    </p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>收集個人資料聲明</h3>

                    <p className={PrivacyStyles.sectionContent}>
                        當閣下到訪本網站／或購買課程時，本公司會向閣下收集不同種類的資料。
                    </p>

                    <p className={PrivacyStyles.sectionContent}>
                        1. 閣下提供之個人資料屬於自願性質。如所要求的個人資料未獲提供，或所提供的資料屬不準確或不齊全，可能導致本公司無法為閣下提供有關的資訊或服務，或處理閣下之申請。
                    </p>

                    <p className={PrivacyStyles.sectionContent}>
                        2. 在以下（但不限於）情況下，本公司可能會要求閣下提供個人資料，包括但不限於閣下之姓名、登入用戶名稱和密碼、地址、電話號碼、姓別、年齡、出生日期、職業、教育程度以及電郵地址。
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        ﹣ 購買本網站的網上課程
                    </p>

                    <p className={PrivacyStyles.sectionContent}>
                        3. 若閣下向本網站選購某些產品或服務，並選擇以信用卡付款，閣下可能需要提供信用卡帳號及到期日。
                    </p>

                    <p className={PrivacyStyles.sectionContent}>
                        4. 當閣下申請由本公司及/或其他策略或聯營合作伙伴共同運作的會員會藉、申請獲取電子新聞、資料及/或業務通訊時，閣下可能會被問及特定的問題。當閣下與本網站通訊時是經由電子郵件、回應表格或透過資訊熱線提供資料，閣下的個人資料亦可能被收集。閣下提供的個人資料可能包括閣下的全名、性別、年齡、職業、教育程度、地址、電子郵件地址、和電話號碼。
                    </p>

                    <p className={PrivacyStyles.sectionContent}>
                        本公司可能使用不同的科技，諸如網路協定位址及「曲奇」檔案，在無需由閣下主動提供的情況下，收集有關閣下使用本網站的資料。
                    </p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>收集資料之目的</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        1. 閣下提供之個人資料可令閣下享有的好處將包括獲取電子新聞、資料或業務通訊、或參與特定活動如銷售及/或購買貨品，及/或參與本公司舉辦的活動。
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        2. 收集的個人資料可能會被用作發放機構資訊之用途；改善本公司或其他由本公司或其策略或聯營合作伙伴 運作的網站之內容；保障該公司法律上的權利；及/或為符合香港特別行政區之法律包括政府或監管機構的要求。
                    </p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>披露閣下之個人資料予第三方</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        本公司非常尊重閣下的私隱。一般而言，閣下之個人資料將會被保密。但在某些情況下該公司可能會向第三方披露閣下的資料，如：
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        1. 因為本公司之運作而向提供服務或意見的工作人員、代理、顧問、核數師、承辦商或服務提供者披露；
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        2. 若本公司認為基於某些理由，包括但不限於侵犯知識產權或其他民事索償，有必要對閣下採取法律行動，閣下之個人資料會被交予適當的第三方以作識別及對閣下採取法律行動；
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        3. 根據任何適用於香港境內或境外的法律或法庭命令而需作出披露。
                    </p>
                    <p className={PrivacyStyles.sectionContent}>
                        閣下明白本私隱政策聲明並不適用於由閣下經本網站傳送給第三者的個人資料及該公司無需就第三者使用該等資料的方式負責。
                    </p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>查閱及更正資料</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        按照香港的個人資料（私隱）條例，閣下可要求查閱由本公司收集閣下的個人資料和要求從本公司的資料庫更正或移除閣下的個人資料。閣下可電郵至melearn@enrichculture.com 或致函香港九龍觀塘鴻圖道78號17樓A室天窗文化集團提出上述要求。</p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>保安</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        本公司會採取適當步驟以防止閣下提供的個人資料被不當使用、遺失，未經授權存取、披露、更改或破壞。但本公司不會對任何不在其控制範圍下發生的個人 資料遺失、不當使用、未經授權存取、披露、更改或破壞而承擔責任。閣下亦應採取一切必需步驟以確保未獲授權者不會得到閣下之用戶名稱和密碼。</p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>連結其他網站</h3>
                    <p className={PrivacyStyles.sectionContent}>
                        本公司或會提供與其他網站或資源之連結或參照。請注意該公司無法控制上述並非由該公司運作的網站及連結，而且在任何情況下此私隱政策聲明都不適用於該等網站和連結，那些連結僅為方便閣下而提供。</p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>如何聯絡我們</h3>
                    <p className={PrivacyStyles.sectionContent}>倘閣下對此私隱政策聲明或資料收集之方式有任何疑問或意見，閣下可電郵至melearn@enrichculture.com與本公司聯絡。</p>
                </div>
                <div className={PrivacyStyles.section}>
                    <h3 className={PrivacyStyles.sectionTitle}>私隱政策聲明的修訂</h3>
                    <p className={PrivacyStyles.sectionContent}>此私隱政策聲明將被不時修訂。閣下在經本網站提供任何個人資料前，請查閱此私隱政策聲明的更新版本。</p>
                </div>
            </div>
        </div>
    )
}

export default Privacy
