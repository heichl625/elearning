import React from 'react';

//redux
import { useSelector } from 'react-redux';

//styles
import TopBarStyles from './TopBar.module.scss';

const TopBar = ({course, questionNum, isLoading}) => {

    const submitted = useSelector(store => store.quiz.submitted);
    const answers = useSelector(store => store.quiz.answers);

    return (
        <div className={TopBarStyles.container}>
            <p className={TopBarStyles.sectionName}>課程測驗</p>
            {isLoading ? <div className={TopBarStyles.titleSkeleton}></div> : <h3 className={TopBarStyles.courseTitle}>{course?.title}</h3>}
            {isLoading ? <div className={TopBarStyles.skeletonContainer}>
                <div className={TopBarStyles.skeleton}></div>
                <div className={TopBarStyles.skeleton}></div>
                <div className={TopBarStyles.skeleton}></div>
            </div> : <div className={TopBarStyles.descriptionContainer}>
                {submitted === false && <p className={TopBarStyles.description}>題目總數：{questionNum}題</p>}
                {submitted === false && <p className={TopBarStyles.description}>總分：100分</p>}
                {submitted === false && <p className={TopBarStyles.description}>合格分數：70分</p>}
                {submitted === true && <p className={TopBarStyles.description}>成績：{Math.floor(answers.filter(answer => answer.status === 'correct').length/answers.length*100)}/100分 (70分以上合格) </p>}
            </div>}
        </div>
    )
}

export default TopBar
