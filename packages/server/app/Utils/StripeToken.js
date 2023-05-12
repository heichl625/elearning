const token = () => {
    if(process.env.NODE_ENV === 'production'){
        return 'sk_live_Yx0Kxu9E7Jax1TZwLSTEQIsr'
    }else{
        return 'sk_test_51ILP43I9fIfkJNmASzchDipuXdD59Mze5KJIFH1Qbvw1TYEaobO44TliqVgHco42Yt3Zg2BvWrTaMgMlJswFQvqT00W2Zsbw9U'
    }
}

module.exports = token;