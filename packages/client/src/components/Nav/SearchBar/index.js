import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

//style
import searchBarStyles from './SearchBar.module.scss';


//images
import searchIcon from 'images/icon/btn_search@3x.png';

const SearchBar = ({setShowMobileMenu}) => {

    const history = useHistory();
    const [keywords, setKeywords] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(setShowMobileMenu){
            setShowMobileMenu();
        }
        history.push(`/courses?keywords=${keywords}`);
        setKeywords('');
        
    }

    return (
        <div className={searchBarStyles.searchBar}>
            
            <form onSubmit={handleSubmit} >
                <input className={searchBarStyles.inputField} value={keywords} onChange={(e) => setKeywords(e.target.value)}placeholder="搜尋課程/導師"/>
                <button type="submit" className={searchBarStyles.searchIconContainer}>
                    <img src={searchIcon} className={searchBarStyles.searchIcon} alt="search icon"/>
                </button>
            </form>
        </div>
    )
}

export default SearchBar
