import React, { useEffect, useState } from 'react';
import Axios from 'axios';

//redux
import { useDispatch } from 'react-redux';
import { setSelectedInstructor, setUnreadMsg } from 'redux/actions/inbox';

//component
import InstructorList from 'components/Inbox/InstructorList';
import Chat from 'components/Inbox/Chat';

//styles
import InboxStyles from './Inbox.module.scss';

const Inbox = () => {

    const dispatch = useDispatch();

    const [instructors, setInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);

    useEffect(() => {

        document.title = '向導師發問 - MeLearn.guru';

    }, [])


    useEffect(() => {

        let mounted = true;

        Axios.get('/api/enrolled-course-instructors')
            .then(res => res.data)
            .then(data => {
                if (!data.error && mounted) {
                    setInstructors(data.instructors);
                    setFilteredInstructors(data.instructors);
                    Axios.get('/api/user-unread-messages')
                        .then(res => res.data)
                        .then(data => {
                            if (!data.error) {
                                dispatch(setUnreadMsg(data.unreadMsg))
                            }
                        })
                }
            })

        return () => {
            dispatch(setSelectedInstructor());
            mounted = false;
        }

    }, [])
    
    const setFilterInstructor = (keywords) => {
        if (!keywords) {
            setFilteredInstructors(instructors);
        } else {
            setFilteredInstructors(instructors.filter(instructor => {
                return instructor.name.indexOf(keywords) !== -1
            }))
        }
    }


    return (
        <div className={InboxStyles.container}>
            <InstructorList instructors={instructors} filteredInstructors={filteredInstructors} setFilterInstructor={setFilterInstructor} />
            <Chat instructors={instructors}/>
        </div>
    )
}

export default Inbox
