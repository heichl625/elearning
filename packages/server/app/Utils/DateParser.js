const moment = require('moment-timezone');

module.exports = {
    toSQLForm: (date) => {
        const newDate = moment(date).tz("Asia/Hong_Kong").format('YYYY-MM-DD HH:mm:ss')
        return newDate
    },
    toHTMLForm: (date) => {
        const newDate = moment(date).format('YYYY-MM-DD');
        return newDate
    }
} 