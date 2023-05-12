import React, { useEffect } from 'react'

import TermsStyles from './Terms.module.scss'

const Terms = () => {

    useEffect(() => {

        document.title = '條款及細則 - MeLearn.Guru'

    }, [])

    return (
        <div className={TermsStyles.container}>
            <h2 className={TermsStyles.pageTitle}>條款及細則</h2>
            <div className={TermsStyles.content}>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>MeLearn.guru「自在學」網站服務條款及免責聲明</h3>
                    <p className={TermsStyles.sectionContent}>
                        以下是MeLearn.guru「自在學」(下稱「本網站」)的服務條款及免責聲明：
                    </p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>服務條款</h3>
                    <p className={TermsStyles.sectionContent}>
                        註冊<br />為了能使用本網站，閣下必須先註冊。
                    </p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>私隱</h3>
                    <p className={TermsStyles.sectionContent}>
                        由本網站保存並與閣下有關的「登記資料」及其他相關資料均受到個人資料條例和有關機構「私隱權政策」之規管。
                    </p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>會員帳號、密碼及安全</h3>
                    <p className={TermsStyles.sectionContent}>
                    完成本服務的登記程序之後，閣下將收到一個密碼及帳號。維持密碼及帳號的機密安全，是閣下的責任。利用該密碼及帳號所進行的一切行 動，閣下將負完全的責任。閣下同意以下事項：(a)閣下的密碼或帳號遭到未獲授權的使用，或者其他任何安全問題發生時，閣下將立即通知我們，且(b)每次 連線完畢，均結束閣下的帳號使用。閣下未能遵守本項規定所衍生之任何損失或損害，本網站無法也不予負責。
                    </p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>內容提供</h3>
                    <p className={TermsStyles.sectionContent}>
                    一切向本網站提供的內容，均為內容提供者之責任。換言之，閣下將對經由本網站發放的「內容」負完全的責任。閣下了解使用本網站時，可能會接觸到令人不快、不適當、令人厭惡之內容。在任何情況下，本網站均不為任何內容負責。
                    </p>
                    <br />
                    <p className={TermsStyles.sectionContent}>閣下同意不將本服務作以下用途：</p>
                    <p className={TermsStyles.sectionContent}>(a). 上載、張貼、發送電子郵件或傳送任何非法、有害、脅迫、濫用、騷擾、侵害、中傷、粗俗、猥褻、誹謗、侵害他人私隱、有害或種族歧視的或道德上令人不快的「內容」。</p>
                    <p className={TermsStyles.sectionContent}>(b). 以任何方式傷害未成年人。</p>
                    <p className={TermsStyles.sectionContent}>(c). 冒充任何人或機構，或以虛偽不實的方式陳述或謊稱與任何人或機構之關係。</p>
                    <p className={TermsStyles.sectionContent}>(d). 偽造標題或以其他方式操控識別資料，以偽裝經由本網站傳送之任何內容之來源。</p>
                    <p className={TermsStyles.sectionContent}>(e). 將依據任何法律或契約或信任關係而無權傳送之任何內容加以上載、張貼或以其他方式傳送。</p>
                    <p className={TermsStyles.sectionContent}>(f). 將侵害任何人之任何專利、商標、營業祕密、版權或其他專屬權利之內容加以上載、張貼或以其他方式傳送。</p>
                    <p className={TermsStyles.sectionContent}>(g). 將任何廣告信函、促銷資料、垃圾郵件、濫發信件、連鎖信件、直銷或其他任何形式的勸誘資料加以上載、張貼或以其他方式傳送。</p>
                    <p className={TermsStyles.sectionContent}>(h). 將設計目的在於干擾、破壞或限制任何電腦軟件、硬體或通訊設備的病毒或其他電腦代碼、檔案和程式之任何資料，加以上載、張貼、發送電子郵件或以其他方式傳送。</p>
                    <p className={TermsStyles.sectionContent}>(i). 故意或非故意違反任何適用的本地、國家或國際法規，以及任何具有法律效力之規定。</p>
                    <p className={TermsStyles.sectionContent}>(j). 蒐集和儲存其他使用者之個人資料；如果有關個人資料得到正確儲存，並根據有關的個人資料保障條例而使用，則不在此列。</p>
                    
                    <br/>

                    <p className={TermsStyles.sectionContent}>本網站可拒絕和移除任何內容，例如違反服務條款和令人厭惡之任何內容。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>彌償</h3>
                    <p className={TermsStyles.sectionContent}>
                    一切向本網站提供的內容，均為內容提供者之責任。換言之，閣下將對經由本網站發放的「內容」負完全的責任。閣下了解使用本網站時，可能會接觸到令人不快、不適當、令人厭惡之內容。在任何情況下，本網站均不為任何內容負責。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>終止</h3>
                    <p className={TermsStyles.sectionContent}>閣下同意本網站得基於其自行之考量，因任何理由，或本網站認為閣下已經違反服務條款的明文規定及精神，終止閣下的密碼、帳號或本網站之使用，並將本網站內任何內容加以移除並刪除。本網站無論有否通知閣下，都可以依其自行之考量隨時終止本網站或其任何部分。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>連結</h3>
                    <p className={TermsStyles.sectionContent}>閣下了解並同意，閣下提供的網站或資源是否可供利用，本網站不予負責。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>免責聲明</h3>
                    <p className={TermsStyles.sectionContent}>a) 本網站根據本服務條款履行與服務有關的義務，只限於以合理的技能和謹慎為閣下提供的相關服務。服務條款並無任何內容，免除或限制本網站因疏忽、欺詐或其他適用法律不能免除或限制的負責任行為，而導致的死亡或人身損害。</p>
                    <p className={TermsStyles.sectionContent}>(b) 閣下使用本服務之風險由閣下個人負擔。本服務係依「現況」及「現有」基礎提供。本網站明示不提供任何明示或默示的擔保，包含但不限於商業適售性、特定目的之適用性及未侵害第三方的權利。</p>
                    <p className={TermsStyles.sectionContent}>(c) 本網站不保証以下事項：(i) 本網站將符合閣下的要求，(ii) 本網站不受干擾、及時提供、安全可靠或免於出錯，(iii)由本網站之使用而取得之結果為正確或可靠。</p>
                    <p className={TermsStyles.sectionContent}>(d) 是否經由本網站之使用下載或取得任何資料應由閣下自行考量且自負風險，如任何資料之下載而導致閣下電腦系統之任何損壞或資料流失，閣下應負完全責任。</p>
                    <p className={TermsStyles.sectionContent}>(e) 閣下自本網站或經由本網站取得之建議和資訊，無論其為書面或口頭，絕不構成本服務條款未明示規定之任何保証。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>責任限制</h3>
                    <p className={TermsStyles.sectionContent}>閣下明確了解並同意，基於以下原因而造成之損失，包括但不限於利潤、商譽、使用、資料損失或其他無形損失，本網站不承擔任何直接、間 接、附帶、特別、衍生性或懲罰性賠償：(i) 本網站之使用或無法使用，(ii)經由或透過本網站購買或取得之任何商品、資料、資訊或服務，或接收之訊息，或進行之交易所衍生之替代商品及服務之購買成 本，(iii)閣下的傳輸或資料遭到未獲授權的存取或變造，(iv) 本網站中任何第三人之聲明或行為，或(v) 本網站(在此服務條款中以其他方式明確提供的除外)其他相關事宜。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>知識產權保障之內容</h3>
                    <p className={TermsStyles.sectionContent}>閣下必須認明本網站所提供之內容，包括但不限於︰文字、檔案、音樂、聲音檔案、相片、影片、圖案或廣告內容只限閣下於網上瀏覽，並受版權、商標、專利權或其他知識產權法例保障。閣下下載受知識產權保障之內容只限私人或非商業用途。閣下必須保存完整內容，未經本網站同意下，不得翻印、複 製、散播或製造由下載內容而衍生的作品。</p>
                </div>
                <div className={TermsStyles.section}>
                    <h3 className={TermsStyles.sectionTitle}>法例</h3>
                    <p className={TermsStyles.sectionContent}>此訂閱條款受香港特別行政區法例監管。</p>
                </div>
            </div>
        </div>
    )
}

export default Terms
