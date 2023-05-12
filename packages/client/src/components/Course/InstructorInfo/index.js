import React, { useRef, useEffect } from 'react'

//styles
import InstructorInfoStyles from './InstructorInfo.module.scss';



const InstructorInfo = ({ instructor, isLoading }) => {

    const instructorRef = useRef(null);

    useEffect(() => {

        if (instructor) {
            instructorRef.current.innerHTML = instructor.description
        }

    }, [instructor])

    return (
        <div className={InstructorInfoStyles.container}>
            <h2 className={InstructorInfoStyles.seciontTitle}>導師簡介</h2>
            <div className={InstructorInfoStyles.instructorContent}>
                <div className={InstructorInfoStyles.instructorWrapper}>
                    <div className={InstructorInfoStyles.left}>
                        {isLoading ? <div className={InstructorInfoStyles.coverSkeleton}></div> : <img src={instructor?.avator} className={InstructorInfoStyles.avator} alt={instructor?.name}/>}
                        {isLoading ? <div className={InstructorInfoStyles.nameSkeleton}></div> : <h3 className={InstructorInfoStyles.instructorName}>{instructor?.name}</h3>}
                    </div>
                    <div className={`${InstructorInfoStyles.right} ${isLoading ? InstructorInfoStyles.hidden : ''}`}ref={instructorRef}>
                    </div>
                    {isLoading && <div className={InstructorInfoStyles.contentSkeleton}>
                        <div className={InstructorInfoStyles.skeleton}></div>
                        <div className={InstructorInfoStyles.skeleton}></div>
                        <div className={InstructorInfoStyles.skeleton}></div>
                        <div className={InstructorInfoStyles.skeleton}></div>
                        <div className={InstructorInfoStyles.skeleton}></div>

                    </div>}
                </div>
            </div>
        </div>
    )
}

export default InstructorInfo

