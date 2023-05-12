import React from 'react';


//styles
import SuggestionStyles from './Suggestion.module.scss'

import CourseList from 'components/CourseList';
import CourseCardSkeleton from 'components/CourseCardSkeleton';

const Suggestion = ({suggestionList, isLoading}) => {

    return (
        <div className={SuggestionStyles.container}>
            <h3 className={SuggestionStyles.title}>您可能感興趣的課程</h3>
            {isLoading ? <CourseCardSkeleton /> : (suggestionList?.length > 0 && <CourseList courses={suggestionList} />)}
        </div>
    )
}

export default Suggestion
