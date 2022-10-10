const schedule = require('node-schedule');
let state = new Map()
function isLinited(account) {
    if (state.get(account) && state.get(account) >= 3) {
        console.log(state.get(account))
        return true
    } else {
        state.get(account)
        return false
    }
}

function setState(account) {
    if (state.get(account)) {
        state.set(account, state.get(account) + 1)
    } else {
        state.set(account, 1)
    }
}

let rule = new schedule.RecurrenceRule();
rule.hour = [0];

schedule.scheduleJob(rule, () => {
    state = []
});


module.exports = {
    setState,
    isLinited
}