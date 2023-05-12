let mailConfig;

if (process.env.NODE_ENV === 'production') {
    mailConfig = {
        host: 'smtp.abchk.com',
        port: 465,
        secure: false,
        auth: {
            user: 'noreply@enrichculture.com',
            pass: 'a9vUOb5Tm'
        },
        tls: {
            rejectUnauthorized: false
        }
    }
} else {
    // mailConfig = {
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'lazaro83@ethereal.email',
    //         pass: 'fvJ4F2r5y5jCanVmpH'
    //     }
    // }
    mailConfig = {
        host: 'smtp.abchk.com',
        port: 465,
        secure: false,
        auth: {
            user: 'noreply@enrichculture.com',
            pass: 'a9vUOb5Tm'
        },
        tls: {
            rejectUnauthorized: false
        }
    }
}

const forgotPassword = (username, token) => {

    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
		<p>${username}, 你好!</p>
		<p>我們已收到你重設MeLearn.guru密碼的請求，你可以按下方的連結來重新設定你的密碼：</p>
		<a href='${process.env.BASE_URL}/reset-password/${token}'>按此重設您的密碼</a>
		<br />
		<br />
		<p>如果你沒有要求設定新密碼，或對上述登入資料存有疑問，請電郵<a href='melearn@enrichculture.com'>melearn@enrichculture.com</a>, 我們將在辦公時間內（週一至週五的早上9時至晚上6時）盡快回覆。</p>
        <br />
        <br />
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
	</div>
    </body>
    </html>
    `

}

const registration = (user) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
		<p>${user.username}, 您好!</p>
		<p>感謝您選擇MeLearn.guru。您已成功登記成為MeLearn.guru學員，快來開展您的學習之旅！</p>
        <br />
        <p>您可使用以下資料登入MeLearn.guru：</p>
        <table>
            <tbody>
                <tr>
                    <td>用戶名稱：</td>
                    <td>${user.username}</td>
                </tr>
                <tr>
                    <td>密碼：</td>
                    <td>閣下登記時所輸入的密碼</td>
                </tr>
            </tbody>
        </table>
        <br />
		<a href='${process.env.BASE_URL}'>立即到MeLearn.guru開始你的學習課程！</a>
		<br />
		<br />
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
       
	</div>
    </body>
    </html>
    `
}

const handlingOrder = (courses, transaction, transactionArr, user, coupon) => {

    let method = '';
    let status = '';

    switch (transaction.method) {
        case 'creditcard':
            method = '信用卡';
            break;
        case 'alipay':
            method = 'Alipay';
            break;
        case 'fps':
            method = '轉數快';
            break;
        case 'bank-transfer':
            method = '銀行轉賬';
            break;
        default:
            break;
    }

    switch (transaction.status) {
        case 'verified':
            status = '成功';
            break
        case 'failed':
            status = '失敗';
            break;
        case 'pending':
            status = '正在驗證付款';
            break;
        default:
            break;
    }

    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>${user.username}, 您好!</p>
        <p>感謝您在MeLearn.guru上選購課程！</p>
        <p>我們正在處理你的訂單，付款驗證完畢後，我們會再次通知你。</p>
        <p>以下是你於${new Date(transaction.created_at).toLocaleDateString()}選購的課程（訂單編號： #${transaction.id}）</p>
        <br />
        <div style="background-color: rgb(235, 235, 235); width: 100%">
            <h3>訂單及付款概要</h3>
            <p style="margin: 0">付款方式：${method}</p>
            <p style="margin: 0">付款狀態：${status}</p>
            <table style='width: 100%; border-collapse: collapse; border: 1px solid black; background-color: #ffffff' >
                <tr style="border: 1px solid black;">
                    <th style="text-align: left; border: 1px solid black;">課程名稱</th>
                    <th style="text-align: right; border: 1px solid black;">價錢</th>
                </tr>
                ${courses.length > 0 && courses.map((course, index) => `<tr style="border: 1px solid black;">
                    <td>${course.title}</td>
                    <td style='text-align: right'>
                        ${transactionArr[index].price === course.price ? `HKD$${transactionArr[index].price}.00` : `<p>原價： HKD$${course.price}.00</p><p>${course.discount_text}：HKD$${course.discount_price}.00</p><p>共節省： HKD$${course.price - course.discount_price}.00</p>`}
                    </td>
                </tr>`)}
                <tr>
                    <td>優惠碼： ${coupon ? coupon.code : '-'}</td>
                    <td style="text-align: right">- HKD$${coupon ? coupon.discount : '0'}.00</td>
                </tr>
                <tr>
                    <td>
                    </td>
                    <td style="text-align: right">
                        小計： HKD$${transaction.total}.00
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <p>祝您有一趟愉快的學習旅程！</p>
        <br />
		<br />
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
    </div>
    </body>
    </html>
    `
}

const enrichNotification = (courses, transaction, transactionArr, user, coupon) => {
    let method = '';
    let status = '';

    switch (transaction.method) {
        case 'creditcard':
            method = '信用卡';
            break;
        case 'alipay':
            method = 'Alipay';
            break;
        case 'fps':
            method = '轉數快';
            break;
        case 'bank-transfer':
            method = '銀行轉賬';
            break;
        default:
            break;
    }

    switch (transaction.status) {
        case 'verified':
            status = '成功';
            break
        case 'failed':
            status = '失敗';
            break;
        case 'pending':
            status = '正在驗證付款';
            break;
        default:
            break;
    }

    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>您好!</p>
        <p>MeLearn.guru 有新的購買記錄</p>
        <p>以下是用戶${user.email}於${new Date(transaction.created_at).toLocaleDateString()}的購買記錄（訂單編號： #${transaction.id}）</p>
        <br />
        <div style="background-color: rgb(235, 235, 235); width: 100%">
            <h3>訂單及付款概要</h3>
            <p style="margin: 0">付款方式：${method}</p>
            <p style="margin: 0">付款狀態：${status}</p>
            <table style='width: 100%; border-collapse: collapse; border: 1px solid black; background-color: #ffffff' >
                <tr style="border: 1px solid black;">
                    <th style="text-align: left; border: 1px solid black;">課程名稱</th>
                    <th style="text-align: right; border: 1px solid black;">價錢</th>
                </tr>
                ${courses.length > 0 && courses.map((course, index) => `<tr style="border: 1px solid black;">
                    <td>${course.title}</td>
                    <td style='text-align: right'>
                        ${transactionArr[index].price === course.price ? `HKD$${transactionArr[index].price}.00` : `<p>原價： HKD$${course.price}.00</p><p>${course.discount_text}：HKD$${course.discount_price}.00</p><p>共節省： HKD$${course.price - course.discount_price}.00</p>`}
                    </td>
                </tr>`)}
                <tr>
                    <td>優惠碼： ${coupon ? coupon.code : '-'}</td>
                    <td style="text-align: right">- HKD$${coupon ? coupon.discount : '0'}.00</td>
                </tr>
                <tr>
                    <td>
                    </td>
                    <td style="text-align: right">
                        小計： HKD$${transaction.total}.00
                    </td>
                </tr>
            </table>
        </div>
        <br />
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
    </div>
    </body>
    </html>
    `
}



const shoppingReceipt = (courses, transaction, transactionArr, user, coupon) => {

    let method = '';
    let status = '';

    switch (transaction.method) {
        case 'creditcard':
            method = '信用卡';
            break;
        case 'alipay':
            method = 'Alipay';
            break;
        case 'fps':
            method = '轉數快';
            break;
        case 'bank-transfer':
            method = '銀行轉賬';
            break;
        default:
            break;
    }

    switch (transaction.status) {
        case 'verified':
            status = '成功';
            break
        case 'failed':
            status = '失敗';
            break;
        case 'pending':
            status = '正在驗證付款';
            break;
        default:
            break;
    }

    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>${user.username}, 您好!</p>
        <p>感謝您購買了MeLearn.guru上的課程！</p>
        <p>以下是您於${new Date(transaction.created_at).toLocaleDateString()}購買的課程收據（訂單編號： #${transaction.id}）</p>
        <br />
        <div style="background-color: rgb(235, 235, 235); width: 100%">
            <h3>訂單及付款概要</h3>
            <p style="margin: 0">付款方式：${method}</p>
            <p style="margin: 0">付款狀態：${status}</p>
            <table style='width: 100%; border-collapse: collapse; border: 1px solid black; background-color: #ffffff' >
                <tr style="border: 1px solid black;">
                    <th style="text-align: left; border: 1px solid black;">課程名稱</th>
                    <th style="text-align: right; border: 1px solid black;">價錢</th>
                </tr>
                ${courses.length > 0 && courses.map((course, index) => `<tr style="border: 1px solid black;">
                    <td>${course.title}</td>
                    <td style='text-align: right'>
                        ${transactionArr[index].price === course.price ? `HKD$${transactionArr[index].price}.00` : `<p>原價： HKD$${course.price}.00</p><p>${course.discount_text}：HKD$${course.discount_price}.00</p><p>共節省： HKD$${course.price - course.discount_price}.00</p>`}
                    </td>
                </tr>`)}
                <tr>
                    <td>優惠碼： ${coupon ? coupon.code : '-'}</td>
                    <td style="text-align: right">- HKD$${coupon ? coupon.discount : '0'}.00</td>
                </tr>
                <tr>
                    <td>
                    </td>
                    <td style="text-align: right">
                        小計： HKD$${transaction.total}.00
                    </td>
                </tr>
            </table>
        </div>
        <br />
        <p>祝您有一趟愉快的學習旅程！</p>
        <a href="${process.env.BASE_URL}">立即上課</a>
        <br />
		<br />
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
    </div>
    </body>
    </html>
    `
}

const cartReminder = (username, items) => {

    const tableHtml = items.map((item, index) => {
        let discount_price
        let now = new Date();

        if (item.discount_price && !item.discount_start) {
            discount_price = item.discount_price;
        }
        if (item.discount_price && item.discount_start) {
            if (new Date(item.discount_start) <= now && new Date(item.discount_end) > now) {
                discount_price = item.discount_price
            }
        }

        return `<tr>
            <td style="border: 1px solid #363636; font-size: 18px; width: 40%">
                <div>
                    <p>《${item.title}》</p>
                    <img src="cid:${item.course_id}" style="width: 100%; max-width: 150px;"/>
                </div>
            </td>
            <td style="border: 1px solid #363636">
                <div style="text-align: right">
                    <div>
                        <p style="font-size: 16px; font-weight: 600;">完成課程後，你會學到： </p>
                        ${item.learn}
                    </div>
                    <p style="color: #363636; font-size: 14px; margin: 0;">${discount_price ? '原價' : '價錢'}: HK$${item.price}.00</p>
                    ${discount_price ? `<p style="color: red; font-size: 14px; margin: 0;">${item.discount_text}: HK$${discount_price}.00</p>` : ''}
                </div>
            </td>
        </tr>`
    })

    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
		<p>${username}, 你好!</p>
		<p>感謝您到訪MeLearn.guru網站，感受自由自在學習的樂趣。</p>
		<p>您已添加了以下的課程到購物車當中，但尚未付款</p>
        <table style='border-collapse: collapse; width: 100%;'>
            <tbody>
                ${tableHtml.join('')}         
            </tbody>
        </table>
        <p>立即<a href="${process.env.BASE_URL}">登錄</a>購買課程吧！</p>
		<br />
		<br />
        <p>預祝您有一趟愉快而充實的學習旅程！</p>
		<p>MeLearn.guru謹啟</p>
		<br />
		<br />
		<br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
	</div>
    </body>
    </html>
    `

}

const changePasswordSuccess = (username) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>${username}, 您好!</p>
        <p>感謝您選擇MeLearn.guru。</p>
        <br />
        <p>閣下已成功更改密碼。</p>
        <br />
        <p>假如您對上述登入資料存有疑問，請電郵<a href="mailto:melearn@enrichculture.com">melearn@enrichculture.com</a> ，我們將在辦公時間內（週一至週五的早上9時至晚上6時）盡快回覆。</p>
        <br />
        <p>MeLearn.guru謹啟</p>
        <br />
        <br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
    </div>
    </body>
    </html>
`
}

const enquiry = (email, type, content) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <table style="border-collapse: collapse; border: 1px solid #000000; width: 100%">
            <tr>
                <td style="border: 1px solid #000000">查詢電郵</td>
                <td style="border: 1px solid #000000">${email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000">查詢選項</td>
                <td style="border: 1px solid #000000">${type}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000">查詢內容</td>
                <td style="border: 1px solid #000000; margin: 0; white-space: pre">${content}</td>
            </tr>
        </table>
        
	</div>
    </body>
    </html>
    `
}

const newCommentNotification = (email, course_name, rating, comment) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <table style="border-collapse: collapse; border: 1px solid #000000; width: 100%">
            <tr>
                <td style="border: 1px solid #000000">撰寫評價的用戶</td>
                <td style="border: 1px solid #000000">${email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000">課程</td>
                <td style="border: 1px solid #000000">${course_name}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000">評分</td>
                <td style="border: 1px solid #000000">${rating}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000">評價</td>
                <td style="border: 1px solid #000000; margin: 0; white-space: pre">${comment}</td>
            </tr>
        </table>
        <a href="${process.env.BASE_URL}/cms">按此進入CMS審批</a>
	</div>
    </body>
    </html>
    `
}

const unreadMsgReminder = (instructor_name, unreadMsg) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>${instructor_name}導師, 您好!</p>
        <br/>
        <p>您有${unreadMsg}個未讀訊息，你可以按下方的連結登入MeLearn.Guru的訊息系統回覆學員。</p>
        <a href="${process.env.BASE_URL}/cms">${process.env.BASE_URL}/cms</a>
        <br/>
        <p>感謝！</p>
        <p>MeLearn.Guru謹啟</p>
        <br />
        <br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
	</div>
    </body>
    </html>
    `
}

const receivedNewMessage = (user_id, message, instructor_name) => {
    return `
    <html>
    <body>
    <div style='margin: 0; width: 100%; max-width: 700px; background-color: #ffffff; margin-left: auto; margin-right: auto; color: #363636'>
        <div style='text-align: center'>
            <img src='${process.env.BASE_URL}/media/logo_email.png' />
        </div>
        <p>${instructor_name}導師, 您好!</p>
        <br/>
        <p>您收到一封來自用戶#${user_id}的訊息</p>
        <p>內容： ${message.message || '請登入查看附件'}</p>
        <p>你可以按下方的連結登入MeLearn.Guru的訊息系統回覆學員。</p>
        <a href="${process.env.BASE_URL}/cms">${process.env.BASE_URL}/cms</a>
        <br/>
        <p>感謝！</p>
        <p>MeLearn.Guru謹啟</p>
        <br />
        <br />
        <p style='color: #363636; text-align: center; margin: 0'>在自學，自在學</p>
        <p style='color: #363636; text-align: center; margin: 0'>Chill Smart!</p>
        <hr>
        <p>*此電郵由電腦系統自動寄出，請不要回覆。*</p>
        <p>*Please do not reply to this email.*</p>
        <table>
            <tbody>
                <tr>
                    <td style="vertical-align:top">聯絡我們 Contact Us</td>
                    <td></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">地址 Address:</td>
                    <td>九龍觀塘鴻圖道78號17樓A室<br/>Unit A, 17/F, 78 Hung To Road, <br /> Kwun Tong, Kowloon</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電話 Contact Number：</td>
                    <td>27935678</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">WhatsApp查詢：</td>
                    <td>(+852) 9547 2211</td>
                </tr>
                <tr>
                    <td style="vertical-align:top">電郵地址 Email Address：</td>
                    <td><a href='mailto:melearn@enrichculture.com'>melearn@enrichculture.com</a></td>
                </tr>
                <tr>
                    <td style="vertical-align:top">辦公時間 Working Hours：</td>
                    <td></td>
                </tr>
                <tr>
                    <td>星期一至五：</td>
                    <td>上午9:00 – 下午6:00</td>
                </tr>
                <tr>
                    <td>星期六、日及公眾假期：</td>
                    <td>休息</td>
                </tr>
            </tbody>
        </table>
	</div>
    </body>
    </html>
    `
}

module.exports = {

    mailConfig: mailConfig,
    template: {
        forgotPassword: forgotPassword,
        registration: registration,
        shoppingReceipt: shoppingReceipt,
        enrichNotification: enrichNotification,
        handlingOrder: handlingOrder,
        cartReminder: cartReminder,
        enquiry: enquiry,
        newCommentNotification: newCommentNotification,
        changePasswordSuccess: changePasswordSuccess,
        unreadMsgReminder: unreadMsgReminder,
        receivedNewMessage: receivedNewMessage
    }

}