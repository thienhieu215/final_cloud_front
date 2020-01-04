import * as Types from '../action/constants.js';

var initialState = {
    events: [],
    event: {},
};

export default function (state = initialState, action) {

    switch (action.type) {
        case Types.FETCH_EVENTS:
            return {
                ...state,
                events: action.payload
            }
        case Types.FETCH_EVENTS_BY_ID:
            return {
                ...state,
                event: action.payload
            }
        case Types.DOWNLOAD_EVENTS_BY_ACCOUNT:
            return {
                ...state,
                events: action.payload
            }
        case Types.FETCH_EVENTS_BY_OWNER:
            return {
                ...state,
                events: action.payload
            }
        case Types.ADD_EVENTS:
            return {
                ...state,
                events: [...state.events, action.payload]
            }
        case Types.DELETE_EVENTS:
            let filtered = state.events.filter((event) => event.clean_site_id !== action.payload.toString())
            return {
                ...state,
                events: filtered
            }
        case Types.EDIT_EVENTS:
            let filteredEdit = state.events.filter((event) => event.clean_site_id !== action.payload)
            return {
                ...state,
                events: filteredEdit
            }
        default: return state
    }
}