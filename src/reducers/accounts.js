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

        case Types.EDIT_ACCOUNT:
            let filteredEdit = state.accounts.filter((acc) => acc.acc_id !== action.payload)
            return {
                ...state,
                accounts: filteredEdit
            }
        default: return state
    }
}