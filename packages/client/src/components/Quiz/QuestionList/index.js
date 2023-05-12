import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

//component
import QuestionBlock from '../QuestionBlock';

//styles
import QuestionListStyles from './QuestionList.module.scss';

const QuestionList = ({ questions, isLoading }) => {

    const [selectedQuestion, setSelectedQuestion] = useState();

    return (
        <div className={QuestionListStyles.container}>
            {isLoading ? <div>
                <div className={QuestionListStyles.skeletonContainer}>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.statusSkeleton}></div>
                </div>
                <div className={QuestionListStyles.skeletonContainer}>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.statusSkeleton}></div>
                </div>
                <div className={QuestionListStyles.skeletonContainer}>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.statusSkeleton}></div>
                </div>
                <div className={QuestionListStyles.skeletonContainer}>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.statusSkeleton}></div>
                </div>
                <div className={QuestionListStyles.skeletonContainer}>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.skeleton}></div>
                    <div className={QuestionListStyles.statusSkeleton}></div>
                </div>
            </div> : (questions?.length > 0 && questions.map((question, index) => {
                return <QuestionBlock question={question} index={index} selectedQuestion={selectedQuestion} setSelectedQuestion={(val) => setSelectedQuestion(val)} nextQuestion={() => setSelectedQuestion(questions[index+1])} isLastQuestion={index === questions.length-1} key={uuidv4()}/>
            }))}
        </div>
    )
}

export default QuestionList
