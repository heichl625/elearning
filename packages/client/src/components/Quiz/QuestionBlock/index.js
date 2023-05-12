import React, { useState, useEffect } from 'react';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { addAnswer } from 'redux/actions/quiz'

//styles
import QuestionBlockStyles from './QuestionBlock.module.scss';

//img
import correctImg from 'images/icon/quiz_correct@3x.png'
import incorrectImg from 'images/icon/quiz_incorrect@3x.png'

const QuestionBlock = ({question, index, selectedQuestion, setSelectedQuestion, nextQuestion, isLastQuestion}) => {

    const dispatch = useDispatch();

    const [option, setSelectedOption] = useState();
    const [statusClass, setStatusClass] = useState();
    const [error, setError] = useState(false);
    const [answer, setAnswer] = useState();

    const answers = useSelector(store => store.quiz.answers);
    const submitted = useSelector(store => store.quiz.submitted);

    const handleConfirm = () => {

        setError(false);

        if(!option && !answers.find(item => item.quesiton_id === question.id)){
            setError(true)
            return;
        }

        if(answer?.status){
            nextQuestion();
            return
        }

        if(option.option === question.answer){
            dispatch(addAnswer({
                question_id: question.id,
                option: option.option,
                status: 'correct'
            }))
        }else{
            dispatch(addAnswer({
                question_id: question.id,
                option: option.option,
                status: 'incorrect'
            }))
        }

    }

    useEffect(() => {

        if(answers?.length > 0 && answers.find(answer => answer.question_id === question.id)){
            setAnswer(answers.find(answer => answer.question_id === question.id));
            if(answers.find(answer => answer.question_id === question.id).status === 'correct'){
                setStatusClass(QuestionBlockStyles.correctText)
            }else{
                setStatusClass(QuestionBlockStyles.incorrectText)
            }
        }else{
            setStatusClass();
            setAnswer();
            setSelectedOption();
        }

    }, [answers])

    const handleOptionClicked = (option) => {

        if(!answer){
            setSelectedOption(option)
        }

    }

    
    return (
        <div className={`${QuestionBlockStyles.questionContainer} ${selectedQuestion?.id === question.id ? QuestionBlockStyles.activeContainer : ''}`}>
            <div className={QuestionBlockStyles.questionBlock} onClick={() => setSelectedQuestion(question)}>
                <div className={QuestionBlockStyles.questionTopContainer}>
                    <p className={QuestionBlockStyles.questionNumber}>第{index + 1}題</p>
                    <p className={QuestionBlockStyles.question}>{question.question}</p>
                </div>
                <p className={`${QuestionBlockStyles.questionStatus} ${statusClass}`}>{(answer && (answer?.status === 'incorrect' ? '錯誤' : '正確' )) || '未完成'}</p>
            </div>
            {error && <p className={QuestionBlockStyles.error}>請選擇答案</p>}
            {selectedQuestion?.id === question?.id && <div className={QuestionBlockStyles.optionsContainer}>
                <div className={`${QuestionBlockStyles.optionBlock} ${answer ? QuestionBlockStyles.disableBlock : ''} ${option?.option === 'a' ? QuestionBlockStyles.activeOption : ''} ${answer?.option === 'a' && (answer?.status === 'correct' ? QuestionBlockStyles.correctOption : answer?.status === 'incorrect' ? QuestionBlockStyles.incorrectOption : '')} ${answer?.status === 'incorrect' && submitted === true && question.answer === 'a' && QuestionBlockStyles.correctOption}`} onClick={() => handleOptionClicked(question.options.find(option => option.option === 'a'))}>
                    {question.options.find(option => option.option === 'a')?.description}
                    {((answer?.option === 'a' && answer?.status === 'correct') || (submitted === true && answer?.status === 'incorrect' && question.answer === 'a')) && <img src={correctImg} className={QuestionBlockStyles.icon} alt="correct icon"/>}
                    {answer?.option === 'a' && answer?.status === 'incorrect' && <img src={incorrectImg} className={QuestionBlockStyles.icon} alt="incorrect icon"/>}
                </div>
                <div className={`${QuestionBlockStyles.optionBlock} ${answer ? QuestionBlockStyles.disableBlock : ''} ${option?.option === 'b' ? QuestionBlockStyles.activeOption : ''} ${answer?.option === 'b' && (answer?.status === 'correct' ? QuestionBlockStyles.correctOption : answer?.status === 'incorrect' ? QuestionBlockStyles.incorrectOption : '')} ${answer?.status === 'incorrect' && submitted === true && question.answer === 'b' && QuestionBlockStyles.correctOption}`} onClick={() => handleOptionClicked(question.options.find(option => option.option === 'b'))}>
                    {question.options.find(option => option.option === 'b')?.description}
                    {((answer?.option === 'b' && answer?.status === 'correct') || (submitted === true && answer?.status === 'incorrect' && question.answer === 'b')) && <img src={correctImg} className={QuestionBlockStyles.icon} alt="correct icon"/>}
                    {answer?.option === 'b' && answer?.status === 'incorrect' && <img src={incorrectImg} className={QuestionBlockStyles.icon} alt="incorrect icon"/>}
                </div>
                <div className={`${QuestionBlockStyles.optionBlock} ${answer ? QuestionBlockStyles.disableBlock : ''} ${option?.option === 'c' ? QuestionBlockStyles.activeOption : ''} ${answer?.option === 'c' && (answer?.status === 'correct' ? QuestionBlockStyles.correctOption : answer?.status === 'incorrect' ? QuestionBlockStyles.incorrectOption : '')} ${answer?.status === 'incorrect' && submitted === true && question.answer === 'c' && QuestionBlockStyles.correctOption}`} onClick={() => handleOptionClicked(question.options.find(option => option.option === 'c'))}>
                    {question.options.find(option => option.option === 'c')?.description}
                    {((answer?.option === 'c' && answer?.status === 'correct') || (submitted === true && answer?.status === 'incorrect' && question.answer === 'c')) && <img src={correctImg} className={QuestionBlockStyles.icon} alt="correct icon"/>}
                    {answer?.option === 'c' && answer?.status === 'incorrect' && <img src={incorrectImg} className={QuestionBlockStyles.icon} alt="incorrect icon"/>}
                </div>
                <div className={`${QuestionBlockStyles.optionBlock} ${answer ? QuestionBlockStyles.disableBlock : ''} ${option?.option === 'd' ? QuestionBlockStyles.activeOption : ''} ${answer?.option === 'd' && (answer?.status === 'correct' ? QuestionBlockStyles.correctOption : answer?.status === 'incorrect' ? QuestionBlockStyles.incorrectOption : '')} ${answer?.status === 'incorrect' && submitted === true && question.answer === 'd' && QuestionBlockStyles.correctOption}`} onClick={() => handleOptionClicked(question.options.find(option => option.option === 'd'))}>
                    {question.options.find(option => option.option === 'd')?.description}
                    {((answer?.option === 'd' && answer?.status === 'correct') || (submitted === true && answer?.status === 'incorrect' && question.answer === 'd')) && <img src={correctImg} className={QuestionBlockStyles.icon} alt="correct icon"/>}
                    {answer?.option === 'd' && answer?.status === 'incorrect' && <img src={incorrectImg} className={QuestionBlockStyles.icon} alt="incorrect icon"/>}
                </div>
            </div>}
            {selectedQuestion?.id === question?.id && !(isLastQuestion && question?.status) && submitted === false && <button className={QuestionBlockStyles.confirmBtn} onClick={handleConfirm}>
                {answer?.status ?  '下一題' : '確認'}
            </button>}
        </div>
    )
}

export default QuestionBlock
