import React from 'react'
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedInstructor } from 'redux/actions/inbox';

//styles
import InstructorListStyles from './InstructorList.module.scss';

//images
import chatIcon from 'images/icon/ask_tutor@3x.png';
import searchIcon from 'images/icon/btn_search@3x.png'

const InstructorList = ({ instructors, filteredInstructors, setFilterInstructor }) => {

    const dispatch = useDispatch();

    const unreadMsg = useSelector(store => store.inbox.unreadMsg);
    const selectedInstructor = useSelector(store => store.inbox.selectedInstructor);

    const handleInstructorClick = (instructor) => {
        dispatch(setSelectedInstructor(instructor))
    }

    return (
        <div className={`${InstructorListStyles.container} ${!selectedInstructor ? InstructorListStyles.mobileContainer : ''}`}>
            <div className={InstructorListStyles.titleContainer}>
                <img src={chatIcon} className={InstructorListStyles.chatIcon} alt="chat icon"/>
                <h3 className={InstructorListStyles.title}>向導師發問</h3>
            </div>
            <div className={InstructorListStyles.searchContainer}>
                <input className={InstructorListStyles.searchField} placeholder='搜尋導師' onChange={(e) => setFilterInstructor(e.target.value)}/>
                <img src={searchIcon} className={InstructorListStyles.searchIcon} alt="search icon"/>
            </div>


            <div className={InstructorListStyles.instructorList}>
                {filteredInstructors?.length > 0 && filteredInstructors.map((instructor, index) => {
                    return <div className={`${InstructorListStyles.instructorBlock} ${selectedInstructor?.id === instructor.id ? InstructorListStyles.activeBlock : ''}`} onClick={() => handleInstructorClick(instructor)} key={uuidv4()}>
                        <img src={instructor.avator} className={InstructorListStyles.avator} alt={instructor.name}/>
                        <p className={InstructorListStyles.instructorName}>{instructor.name}</p>
                        {(unreadMsg?.find(item => item.tutor_id === instructor.id && item.read === 0) && selectedInstructor?.id !== instructor.id) && <div className={InstructorListStyles.unreadIndicator}></div>}
                    </div>
                })}
                {instructors.length === 0 && <p className={InstructorListStyles.reminderText}>請先購買課程再向導師發問</p>}
            </div>

        </div>
    )
}

export default InstructorList
