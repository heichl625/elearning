import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CategoryMenuStyles from './CategoryMenuStyle.module.scss';

const CategoryMenu = () => {    

    const categories = useSelector(store => store.global_setting.categories)

    return (
        <div className={CategoryMenuStyles.category}>
            <div className={CategoryMenuStyles.categoryItem} key="category-all">
                <Link to='/courses'>所有({categories.totalCourseNumber})</Link>
            </div>
            {categories?.categories?.map((category, index) => {
                return (
                    <div className={CategoryMenuStyles.categoryItem} key={`category-${index}`}>
                        <Link to={`/courses?category=${category.id}`}>{category.name}({category.course_number})</Link>
                    </div>
                )
            })}
        </div>
    )
}

export default CategoryMenu
