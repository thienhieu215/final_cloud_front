import * as Types from '../action/constants.js';

var initialState = {
    accounts: [],
    account: {},
};

export default function (state = initialState, action) {

    switch (action.type) {
        case Types.FETCH_ACCOUNTS_BY_ID:
            return {
                ...state,
                account: action.payload
            }
        default: return state
    }
}