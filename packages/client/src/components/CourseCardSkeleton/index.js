import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// Styles
import SkeletonStyles from './Skeleton.module.scss'

const CourseCardSkeleton = () => {
    return (
        <div className={SkeletonStyles.container}>
            <div className={SkeletonStyles.desktop}>
                {[0, 1, 2, 3].map(item =>
                    <div className={SkeletonStyles.courseCard} key={uuidv4()}>
                        <div className={SkeletonStyles.cover}></div>
                        <div className={SkeletonStyles.infoContainer}>
                            <div className={SkeletonStyles.title}></div>
                            <div className={SkeletonStyles.bottomContainer}>
                                <div className={SkeletonStyles.bottomLeft}>
                                    <div className={SkeletonStyles.tutorBar}></div>
                                    <div className={SkeletonStyles.numberOfStudent}></div>
                                </div>
                                <div className={SkeletonStyles.priceContainer}>
                                    <div className={SkeletonStyles.price}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={SkeletonStyles.mobile}>
                <div className={SkeletonStyles.courseCard}>
                    <div className={SkeletonStyles.cover}></div>
                    <div className={SkeletonStyles.infoContainer}>
                        <div className={SkeletonStyles.title}></div>
                        <div className={SkeletonStyles.bottomContainer}>
                            <div className={SkeletonStyles.bottomLeft}>
                                <div className={SkeletonStyles.tutorBar}></div>
                                <div className={SkeletonStyles.numberOfStudent}></div>
                            </div>
                            <div className={SkeletonStyles.priceContainer}>
                                <div className={SkeletonStyles.price}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={SkeletonStyles.courseCard}>
                    <div className={SkeletonStyles.cover}></div>
                    <div className={SkeletonStyles.infoContainer}>
                        <div className={SkeletonStyles.title}></div>
                        <div className={SkeletonStyles.bottomContainer}>
                            <div className={SkeletonStyles.bottomLeft}>
                                <div className={SkeletonStyles.tutorBar}></div>
                                <div className={SkeletonStyles.numberOfStudent}></div>
                            </div>
                            <div className={SkeletonStyles.priceContainer}>
                                <div className={SkeletonStyles.price}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={SkeletonStyles.courseCard}>
                    <div className={SkeletonStyles.cover}></div>
                    <div className={SkeletonStyles.infoContainer}>
                        <div className={SkeletonStyles.title}></div>
                        <div className={SkeletonStyles.bottomContainer}>
                            <div className={SkeletonStyles.bottomLeft}>
                                <div className={SkeletonStyles.tutorBar}></div>
                                <div className={SkeletonStyles.numberOfStudent}></div>
                            </div>
                            <div className={SkeletonStyles.priceContainer}>
                                <div className={SkeletonStyles.price}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CourseCardSkeleton
