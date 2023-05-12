import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import 'moment/locale/zh-hk';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setUnreadMsg, setSelectedInstructor } from 'redux/actions/inbox'

//component
import Spinner from 'components/Spinner';

//Styles
import ChatStyles from './Chat.module.scss';

//images
import mediaIcon from 'images/icon/chat_media@3x.png';
import fileIcon from 'images/icon/chat_document@3x.png';
import sendIcon from 'images/icon/chat_send@3x.png';
import disabledSendIcon from 'images/icon/chat_send_disable@3x.png';
import close from 'images/icon/close_popup@3x.png';
import leftArrow from 'images/icon/arrow_left@3x.png';



const Chat = ({ instructors }) => {

    const dispatch = useDispatch();
    moment.locale('zh-hk')
    const [inputMsg, setInputMsg] = useState('')
    const [msgs, setMsgs] = useState([])
    const [image, setImage] = useState();
    const [file, setFile] = useState();
    const [showReminder, setShowReminder] = useState(false);
    const imageBtnRef = useRef(null);
    const fileBtnRef = useRef(null);
    const inputRef = useRef(null);
    const messageContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const selectedInstructor = useSelector(store => store.inbox.selectedInstructor);
    const [enlargeImage, setEnlargeImage] = useState('');

    const sendMsg = (e) => {

        e.preventDefault();

        if(inputMsg || image || file){
            setIsLoading(true);
            setShowReminder(true);
            const formData = new FormData();
    
            formData.append('tutor_id', selectedInstructor.id);
            formData.append('message', inputMsg)
            formData.append('image', image?.file)
            formData.append('file', file?.file);
    
            Axios.post('/api/user-send-message', formData)
                .then(res => res.data)
                .then(data => {
                    if (!data.error) {
                        
                        setMsgs(prev => [...prev, data.message])
    
                        setInputMsg('')
                        setImage()
                        setFile()
                    }
                    setIsLoading(false);
                })
        }
    }

    const handleImageUpload = () => {
        imageBtnRef.current.click();
    }

    const handleFileUpload = () => {
        fileBtnRef.current.click();
    }

    const handleImageSelected = (e) => {

        let fileSize = Math.floor(e.target.files[0]?.size / 1024);

        if (fileSize <= 5120) {
            setImage({
                file: e.target.files[0],
                src: URL.createObjectURL(e.target.files[0])
            })
        } else {
            alert('你所選取的相片容量超出5MB，請重新選擇')
        }
    }

    const handleFileSelected = (e) => {
        let fileSize = Math.floor(e.target.files[0]?.size / 1024);

        if (fileSize <= 5120) {
            setFile({
                file: e.target.files[0],
                src: URL.createObjectURL(e.target.files[0])
            })
        } else {
            alert('你所選取的檔案容量超出5MB，請重新選擇')
        }

    }

    const downloadFile = (path, fileName) => {
        Axios.post('/api/download-file', {
            path: path
        })
            .then(res => res.data)
            .then(data => {
                if (!data.error) {
                    const a = document.createElement('a');
                    a.href = data.url;
                    a.download = fileName
                    a.click();
                    a.remove();
                }
            })
    }

    useEffect(() => {

        let mounted = true;

        setIsLoading(true)

        if (selectedInstructor) {
            setMsgs([]);
            setShowReminder(false);

            Axios.post('/api/get-messages', {
                tutor_id: selectedInstructor.id
            })
                .then(res => res.data)
                .then(data => {
                    if (!data.error && mounted) {
                        setMsgs(data?.msgs)
                        if (data?.msgs[data.msgs.length - 1]?.sent_by === 'user') {
                            setShowReminder(true)
                        } else {
                            setShowReminder(false)
                        }
                        if(messageContainerRef.current){
                            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight
                        }
                        setIsLoading(false)
                    }
                })
                .then(() => {
                    Axios.get('/api/user-unread-messages')
                        .then(res => res.data)
                        .then(data => {
                            if (!data.error && mounted) {
                                dispatch(setUnreadMsg(data.unreadMsg))
                            }
                        })
                })


        }

        return() => {
            mounted = false;
        }

    }, [selectedInstructor])

    const mobileBackBtnClicked = () => {
        dispatch(setSelectedInstructor());
    }

    const setNewSize = () => {
        inputRef.current.style.height = '0px';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }

    const removeImage = () => {
        setImage();
        imageBtnRef.current.value = '';
    }

    const removeFile = () => {
        setFile();
        fileBtnRef.current.value = '';
    }


    return (
        <div className={`${ChatStyles.container} ${selectedInstructor ? ChatStyles.mobileContainer : ''}`}>
            {enlargeImage && <div className={ChatStyles.enlargeImageBackdrop}>
                <div className={ChatStyles.enlargeImageContainer}>
                    <img src={enlargeImage} className={ChatStyles.enlargeImage} alt="Chat image"/>
                    <img src={close} className={ChatStyles.removeBtn} onClick={() => setEnlargeImage('')} alt="remove icon"/>
                </div>
            </div>}
            {instructors.length > 0 && <div className={ChatStyles.chatContainer}>
                <div className={ChatStyles.instructorBlock}>
                    {selectedInstructor && <img src={leftArrow} className={ChatStyles.mobileBackBtn} onClick={mobileBackBtnClicked} alt="back button"/>}
                    {selectedInstructor && <img src={selectedInstructor?.avator} className={ChatStyles.avator} alt={selectedInstructor?.name}/>}
                    <p className={ChatStyles.instructorName}>{selectedInstructor ? selectedInstructor.name : '請先選擇導師'}</p>
                </div>
                <div className={ChatStyles.chatWrapper} ref={messageContainerRef}>
                    {msgs.length > 0 && msgs.map((msg, index) => {
                        
                        let msg_timeframe = moment(msg.created_at);
                        let dateStr = msg_timeframe.format('MMM Do');
                        let prevDateStr = index > 0 ? moment(msgs[index-1].created_at).format('MMM Do') : '';
                        let timeStr = msg_timeframe.format('LT')

                        if (msg.sent_by === 'user') {
                            return <div className={ChatStyles.messageContainer} key={uuidv4()}>
                                {(index === 0 || (index > 0 && dateStr !== prevDateStr)) && <p className={ChatStyles.date}>{dateStr}</p>}
                                <div className={ChatStyles.userMessageContainer}>
                                    <p className={ChatStyles.timeframe}>{timeStr}</p>
                                    <div className={ChatStyles.userChatBubble}>
                                        {msg?.img_url && <img src={msg.img_url} className={ChatStyles.msgImg} onClick={() => setEnlargeImage(msg.img_url)} alt="message image"/>}
                                        {msg?.file_url && <p href={msg.file_url} className={ChatStyles.fileLink} onClick={() => downloadFile(msg.file_url, msg.file_name)}>{msg.file_name}</p>}
                                        <p className={ChatStyles.userMessage}>{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        } else {
                            return <div className={ChatStyles.messageContainer} key={uuidv4()}>
                                {(index === 0 || (index > 0 && dateStr !== prevDateStr)) && <p className={ChatStyles.date}>{dateStr}</p>}
                                <div className={ChatStyles.instructorMessageContainer}>
                                    <img src={selectedInstructor?.avator} className={ChatStyles.messageAvator} alt={selectedInstructor?.name}/>
                                    <div className={ChatStyles.instructorChatBubble}>
                                        {msg?.img_url && <img src={msg.img_url} className={ChatStyles.msgImg} onClick={() => setEnlargeImage(msg.img_url)} alt="message image"/>}
                                        {msg?.file_url && <p href={msg.file_url} className={ChatStyles.instructorFileLink} onClick={() => downloadFile(msg.file_url, msg.file_name)}>{msg.file_name}</p>}
                                        <p className={ChatStyles.instructorMessage}>{msg.message}</p>
                                    </div>
                                    <p className={ChatStyles.timeframe}>{timeStr}</p>
                                </div>
                            </div>
                        }
                    })}
                    {msgs.length === 0 && !isLoading && <p className={ChatStyles.noMsgText}>未有任何對話</p>}
                    {showReminder && <div className={ChatStyles.reminderContainer}>
                        <p className={ChatStyles.reminderMessage}>導師已收到您的訊息並會盡快回覆 謝謝！</p>
                    </div>}
                </div>
                {isLoading && selectedInstructor && <Spinner />}
                <form className={ChatStyles.inputBlock} onSubmit={sendMsg}>
                    {(image || file) && <div className={ChatStyles.uploadContainer}>
                        {image && <div className={ChatStyles.previewImgContainer}>
                            <img src={image.src} className={ChatStyles.previewImg} alt="attached image preview"/>
                            <img src={close} className={ChatStyles.removeBtn} onClick={removeImage} alt="remove icon"/>
                        </div>}
                        {file && <div className={ChatStyles.filePreviewContainer}>
                            <div className={ChatStyles.filePreview}>{file.file.name}</div>
                            <img src={close} className={ChatStyles.removeBtn} onClick={removeFile} alt="remove icon"/>
                        </div>}
                    </div>}
                    <div className={ChatStyles.inputContainer}>
                        <img className={ChatStyles.icon} src={mediaIcon} onClick={handleImageUpload} alt="image upload icon"/>
                        <input className={ChatStyles.hiddenInput} type='file' accept='.jpeg,.jpg,.png' ref={imageBtnRef} onChange={handleImageSelected} disabled={selectedInstructor ? false : true} />
                        <img className={ChatStyles.icon} src={fileIcon} onClick={handleFileUpload} alt="file upload icon" />
                        <input className={ChatStyles.hiddenInput} onChange={handleFileSelected} type='file' accept='.docx,.pdf,.xlsx,.ppt,.pptx,.doc' ref={fileBtnRef} disabled={selectedInstructor ? false : true} />
                        <textarea
                            className={ChatStyles.inputField}
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            placeholder='請輸入'
                            ref={inputRef}
                            rows="1"
                            onKeyUp={setNewSize}
                            disabled={selectedInstructor ? false : true}>
                        </textarea>
                        <button className={ChatStyles.submitBtn} type='submit' disabled={(!selectedInstructor || (!inputMsg && !image && !file))}>
                            <img src={`${(inputMsg || image || file) ? sendIcon : disabledSendIcon}`} className={ChatStyles.icon} alt="send icon"/>
                        </button>
                    </div>

                </form>
            </div>}
        </div>
    )
}

export default Chat
