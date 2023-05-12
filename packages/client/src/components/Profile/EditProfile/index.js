import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

//components
import AccountInfo from 'components/Profile/AccountInfo';
import EditBilling from 'components/Profile/EditBilling';
import CreditCard from 'components/Profile/CreditCard';

//styles
import EditProfileStyles from './EditProfile.module.scss'

const EditProfile = () => {

    const [selectedTab, setSelectedTab] = useState(0);
    const [tabs] = useState(['帳戶資料', '帳單地址', '信用卡']);

    return (
        <div className={EditProfileStyles.container}>
            <div className={EditProfileStyles.tabContainer}>
                {tabs?.length > 0 && tabs.map((tab, index) => {
                    return <div className={`${EditProfileStyles.tab} ${selectedTab === index ? EditProfileStyles.activeTab : ''}`} onClick={() => setSelectedTab(index)} key={uuidv4()}>{tab}</div>
                })}
            </div>
            {selectedTab === 0 && <AccountInfo />}
            {selectedTab === 1 && <EditBilling />}
            {selectedTab === 2 && <CreditCard />}
        </div>
    )
}

export default EditProfile
