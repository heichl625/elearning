import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setPopupPage, setPopup } from 'redux/actions/global_setting';
import { setProof, clearCheckout, setProceedPayment } from 'redux/actions/checkout';
import { clearCart } from 'redux/actions/cart';

import UploadProofStyles from './UploadProof.module.scss';
import Spinner from 'components/Spinner';

const UploadProof = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const checkout = useSelector(store => store.checkout);
    const loading = useSelector(store => store.global_setting.loading);
    const [error, setError] = useState('');
    const [acHolder, setAcHolder] = useState('');
    const [hideFooter, setHideFooter] = useState(false);

    const hiddenBtnRef = useRef('');

    const handleFileSelectClicked = () => {
        hiddenBtnRef.current.click();
    }

    const handleFileChange = (e) => {
        dispatch(setProof(e.target.files[0]))
    }

    const handleDelete = () => {
        dispatch(setProof())
    }

    const handleSubmit = () => {

        setError('');
        dispatch(setLoading(true));

        if (!acHolder) {
            setError('請輸入銀行賬戶持有人名稱');
            dispatch(setLoading(false));
            return
        }

        const checkPendingTransaction = () => {
            Axios.post('/api/checkout/check-pending-transaction', {
                courses: checkout.items
            })
                .then(res => res.data)
                .then(data => {
                    if (data.error?.PENDING_TRANSACTION) {
                        dispatch(setLoading(false));
                        dispatch(setPopupPage('pending-transaction-exist'))
                        dispatch(setPopup(true))
                    }
                    if (data.next) {
                        dispatch(setProceedPayment(true));
                    }
                })
        }


        if (checkout.proof) {
            checkPendingTransaction();
        } else {
            dispatch(setProceedPayment(true));
        }

    }

    useEffect(() => {

        if (checkout.transaction) {
            setAcHolder(checkout.transaction.holder_name);
        }

    }, [checkout.transaction])

    useEffect(() => {

        const fileData = new FormData();

        fileData.append('proof_file', checkout.proof);

        if (checkout.proceed_payment) {
            if (checkout.transaction) {
                Axios.post('/api/checkout/upload-proof', fileData)
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error) {
                            Axios.post('/api/update-purchase', {
                                transaction_id: checkout.transaction.id,
                                cart: checkout.items,
                                coupon: checkout.coupon,
                                method: checkout.method,
                                billing_info: checkout.billing_info,
                                holder_name: acHolder,
                                proof: data.url
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (!data.error) {
                                        dispatch(setLoading(false));
                                        history.push(`/checkout-finished?transaction_id=${data.transaction.id}`);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    dispatch(setLoading(false));
                                })
                        }
                        else {
                            if (data.error.type === 'size') {
                                setError('檔案大小超出3MB');
                            }
                            dispatch(setLoading(false));
                        }

                    })
            } else {
                Axios.post('/api/checkout/upload-proof', fileData)
                    .then(res => res.data)
                    .then(data => {
                        if (!data.error) {
                            Axios.post('/api/confirm-purchase', {
                                cart: checkout.items,
                                coupon: checkout.coupon,
                                method: checkout.method,
                                billing_info: checkout.billing_info,
                                holder_name: acHolder,
                                proof: data.url
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if (!data.error) {
                                        document.cookie = `cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
                                        dispatch(clearCart())
                                        dispatch(setLoading(false));
                                        history.push(`/checkout-finished?transaction_id=${data.transaction.id}`);
                                    }
                                    if (data.error?.PRICE_CHANGED) {
                                        history.push('/price-changed');
                                        dispatch(clearCheckout());
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    dispatch(setLoading(false));
                                })
                        } else {
                            if (data.error.type === 'size') {
                                setError('檔案大小超出3MB');
                            }

                            dispatch(setLoading(false));
                        }
                    })
            }
            dispatch(setProceedPayment(false))
        }

    }, [checkout.proceed_payment])

    const handleHideFooter = () => {
        setHideFooter(true)
    }

    const handleUnhideFooter = () => {
        setHideFooter(false)
    }

    return (
        <div className={UploadProofStyles.container}>
            {loading ? <Spinner /> : <div>
                <h3 className={UploadProofStyles.sectionTitle}>上傳付款證明</h3>
                <p className={UploadProofStyles.instruction}>透過轉數快或銀行轉賬的客戶，請上傳付款確認通知書。我們會盡快核實款項及處理您的訂單。</p>
                <p className={UploadProofStyles.instruction}>付款方式：</p>
                <ol>
                    <li> 銀行轉賬至香港恆生銀行戶口：347-485195-883 (Enrich Digital Limited)</li>
                    <li>透過轉數快編號 (FPS ID) 付款：166572818 (Enrich Publishing Limited)</li>
                </ol>
                <p className={UploadProofStyles.instruction}>我們會於辦公時間內（星期一至五 上午9:00 – 下午6:00）確認款項後便會將用戶添加到相關課程。</p>
                <br />
                <p className={UploadProofStyles.fileRestriction}>檔案格式：.jpg, .png, .pdf</p>
                <p className={UploadProofStyles.fileRestriction}>檔案大小限制：不多於3MB</p>


               
                <input
                    className={UploadProofStyles.hiddenBtn}
                    ref={hiddenBtnRef}
                    onChange={handleFileChange}
                    name='proof'
                    type='file'
                    accept='.jpg,.png,.pdf,.jpeg' />
                {checkout?.proof ? <div className={UploadProofStyles.fileDisplayContainer}>
                    <p className={UploadProofStyles.fileName}>{checkout?.proof?.name}</p>
                    <p className={UploadProofStyles.deleteBtn} onClick={() => handleDelete()}>刪除</p>
                </div> : <button className={UploadProofStyles.uploadBtn} onClick={handleFileSelectClicked}>選擇檔案</button>}
                <div className={UploadProofStyles.bottom}>
                    <div className={UploadProofStyles.left}>
                        <div className={UploadProofStyles.inputGroup}>
                            <input
                                className={UploadProofStyles.inputField}
                                value={acHolder}
                                onChange={(e) => setAcHolder(e.target.value)}
                                required
                                onFocus={handleHideFooter}
                                onBlur={handleUnhideFooter}
                            />
                            <label className={UploadProofStyles.floatingLabel}>銀行賬戶持有人</label>
                            {error && <p className={UploadProofStyles.errorText}>{error}</p>}
                        </div>
                    </div>
                    <div className={`${UploadProofStyles.right} ${hideFooter ? UploadProofStyles.hidden : ''}`}>
                        <div className={UploadProofStyles.mobileFooterPrice}>
                            <div className={UploadProofStyles.footerPriceRow}>
                                <p className={UploadProofStyles.mobilePriceText}>小計 HK${checkout.subtotal}.00</p>
                                <p className={UploadProofStyles.mobilePriceText}>折扣 {checkout.coupon ? `HK$${checkout.coupon.discount}.00` : '-'}</p>
                            </div>
                            <div className={UploadProofStyles.mobilePriceTotal}>
                                <p className={UploadProofStyles.mobilePriceText}>累計</p>
                                <p className={UploadProofStyles.mobilePriceTotalText}>HK${checkout.coupon ? checkout.subtotal - checkout.coupon.discount : checkout.subtotal}.00</p>
                            </div>
                        </div>
                        <button className={UploadProofStyles.submitBtn} onClick={() => handleSubmit()}>提交</button>
                    </div>
                </div>
            </div>}



        </div>
    )
}

export default UploadProof
