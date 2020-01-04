import {combineReducers} from 'redux'
import volunteers from './volunteers'
import events from'./events'
import accounts from './accounts'

const appReducers = combineReducers({
    events: events,
    volunteers: volunteers,
    accounts: accounts
})

export default appReducers