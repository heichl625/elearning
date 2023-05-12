import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';

const PrivateRoute = ({component: Component, ...rest }) => {

    const isAuth = useSelector(store => store.user.isAuth)

    return (
       <Route {...rest} render={props => (
            isAuth === true ? <Component {...props} /> : isAuth === false ? <Redirect to='/' /> : null
       )} />
    )
}

export default PrivateRoute
