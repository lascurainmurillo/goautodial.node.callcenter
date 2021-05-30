const moment = require('moment');

function formatMessage(user, msg, create_at) {
    return {
        user,
        msg,
        create_at
    }
}

module.exports = formatMessage;