import * as Types from '../action/constants.js';

var initialState = {
    volunteers: [],
    volunteer: {},
    volunteersBySite: []
};

export default function (state = initialState, action) {

    switch (action.type) {
        case Types.FETCH_VOLUNTEERS:
            return {
                ...state,
                volunteers: action.payload
            }
        case Types.FETCH_VOLUNTEERS_BY_EMAIL:
            return {
                ...state,
                volunteer: action.payload
            }
        case Types.FETCH_VOLUNTEERS_BY_SITE:
            return {
                ...state,
                volunteersBySite: action.payload
            }
        case Types.ADD_VOLUNTEERS:
            return {
                ...state,
                volunteers: action.payload
            }
        default: return state
    }
}