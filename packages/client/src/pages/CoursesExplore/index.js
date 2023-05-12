import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { setEnrolledCourses } from 'redux/actions/user'

//component
import CourseCard from 'components/CourseCard/';

//images
import arrowDown from 'images/icon/arrow_large_down_black@3x.png'
import arrowUp from 'images/icon/arrow_large_up_black@3x.png'

//styles
import CoursesExploreStyles from './CoursesExplore.module.scss';
import CourseCardSkeleton from 'components/CourseCardSkeleton';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const CoursesExplore = () => {

    const dispatch = useDispatch();

    const queryParams = useQuery();
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [instructor, setInstructor] = useState('');
    const [categoryDropdown, setCategoryDropdown] = useState(false);
    const [sortMenu, setSortMenu] = useState([
        { key: 'latest', text: '最新到最舊' },
        { key: 'oldest', text: '最舊到最新' },
        { key: 'topselling', text: '最多人報讀' },
        { key: 'cheapest', text: '價格（由低至高）' },
        { key: 'mostexpensive', text: '價格（由高至低）' },
    ])
    const [sortDropdown, setSortDropdown] = useState(false);

    const categories = useSelector(store => store.global_setting.categories);
    const user = useSelector(store => store.user);


    useEffect(() => {

        let mounted = true;

        let url = `/api/courses?keywords=${queryParams.get('keywords') || ''}&category=${queryParams.get('category') || ''}&sortby=${queryParams.get('sortby') || ''}&instructor=${queryParams.get('instructor') || ''}&type=${queryParams.get('type') || ''}`
        Axios.get(url)
            .then(res => res.data)
            .then(data => {
                if(mounted){
                    if (!data.error) {

                        setCourses(data.courses)
                    }
                    if (data.instructor) {
                        setInstructor(data.instructor)
                    }
                }
            })

        if (!queryParams.get('instructor')) {
            setInstructor()
        }

        return () => {
            mounted = false;
        }

    }, [queryParams.get('keywords'), queryParams.get('category'), queryParams.get('sortby'), queryParams.get('instructor'), queryParams.get('type')])

    const searchCategory = (category) => {
        let url = `/courses?keywords=${queryParams.get('keywords') || ''}&category=${category || ''}&sortby=${queryParams.get('sortby') || ''}&instructor=${instructor || ''}&type=${queryParams.get('type') || ''}`
        history.push(url)
    }

    const sortBy = (key) => {
        let url = `/courses?keywords=${queryParams.get('keywords') || ''}&category=${queryParams.get('category') || ''}&sortby=${key}&instructor=${instructor || ''}&type=${queryParams.get('type') || ''}`
        history.push(url)
    }


    useEffect(() => {

        let mounted = true;

        if (user.isAuth) {
            Axios.get('/api/enrolled-courses')
                .then(res => res.data)
                .then(data => {
                    if(mounted){
                        dispatch(setEnrolledCourses(data.enrolledCourses));
                    }
                })
        }

        return () => {
            mounted = false;
        }

    }, [user.isAuth])

    useEffect(() => {

        document.title = '課程一覽 - MeLearn.Guru'

    }, [])

    return (
        <div className={CoursesExploreStyles.container}>
            <div className={CoursesExploreStyles.topBar}>
                <div className={CoursesExploreStyles.title}>
                    <h2 className={CoursesExploreStyles.largerTitle}>{instructor ? instructor : (queryParams.get('keywords') ? '搜尋結果' : '課程')}({courses.length})</h2>
                    {!(queryParams.get('keywords') && !queryParams.get('category')) &&
                        <p className={CoursesExploreStyles.category}>
                            <span>/</span>
                            {(!queryParams.get('category') || !categories?.categories?.find(category => category.id == queryParams.get('category'))) ?
                                '所有' :
                                categories?.categories?.find(category => category.id == queryParams.get('category'))?.name}
                        </p>
                    }
                </div>
                <div className={CoursesExploreStyles.filters}>
                    <div className={CoursesExploreStyles.selectGroup}>
                        <label className={CoursesExploreStyles.selectLabel}>類別</label>
                        <div className={CoursesExploreStyles.selectField} onClick={() => setCategoryDropdown(prev => !prev)}>
                            <p className={CoursesExploreStyles.selectedField}>
                                {(!queryParams.get('category') || !categories?.categories?.find(category => category.id == queryParams.get('category'))) ?
                                    '所有' :
                                    categories?.categories?.find(category => category.id == queryParams.get('category'))?.name}
                            </p>
                            <img src={categoryDropdown ? arrowUp : arrowDown} className={CoursesExploreStyles.arrowIcon} alt="show/hide button"/>
                            {categoryDropdown && <div className={CoursesExploreStyles.dropdown}>
                                <div className={CoursesExploreStyles.dropdownItem} onClick={() => searchCategory()}>所有</div>
                                {categories?.categories?.map(category => {
                                    return <div className={CoursesExploreStyles.dropdownItem} onClick={() => searchCategory(category.id)} key={uuidv4()}>{category.name}</div>
                                })}
                            </div>}
                        </div>
                    </div>
                    <div className={CoursesExploreStyles.selectGroup}>
                        <label className={CoursesExploreStyles.selectLabel}>排序</label>
                        <div className={CoursesExploreStyles.selectField} onClick={() => setSortDropdown(prev => !prev)}>
                            <p className={CoursesExploreStyles.selectedField}>
                                {queryParams.get('sortby') ? sortMenu?.find(sort => sort.key == queryParams.get('sortby'))?.text : '最新到最舊'}
                            </p>
                            <img src={sortDropdown ? arrowUp : arrowDown} className={CoursesExploreStyles.arrowIcon} alt="show/hide button"/>
                            {sortDropdown && <div className={`${CoursesExploreStyles.dropdown} ${CoursesExploreStyles.sortDropdown}`}>
                                {sortMenu.map(item => {
                                    return <div className={CoursesExploreStyles.dropdownItem} onClick={() => sortBy(item.key)} key={uuidv4()}>{item.text}</div>
                                })}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={CoursesExploreStyles.coursesListContainer}>
                {courses ? courses.map((course, index) => {
                    return (
                        <div className={CoursesExploreStyles.card} key={uuidv4()}>
                            <CourseCard course={course}  />
                        </div>)
                }) : <CourseCardSkeleton />}
            </div>
        </div>
    )
}

export default CoursesExplore
