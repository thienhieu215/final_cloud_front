import * as Types from './constants.js';
import axios from 'axios'

/////// ADD EVENTS
export const actionAddEventsRequest = (event) => {
    return async (dispatch) => {
        console.log("check")
        return axios({
            method: 'POST',
            url: 'http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite',
            data: event
        }).then(res => {
            console.log("add event", res.data)
            dispatch(actionAddEvents(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionAddEvents = (event) => {
    return {
        type: Types.ADD_EVENTS,
        payload: event
    }
}

/////// DELETE EVENTS
export const actionDeleteEventsRequest = (id) => {
    return async (dispatch) => {

        return axios({
            method: 'POST',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/delete/${id}`,
            data: null
        }).then(res => {
            console.log(res.data, "data")
            dispatch(actionDeleteEvents(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionDeleteEvents = (res) => {
    return {
        type: Types.DELETE_EVENTS,
        payload: res
    }

}

/////// EDIT EVENTS
export const actionEditEventsRequest = (event, id) => {
    return async (dispatch) => {
        return axios({
            method: 'PUT',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/${id}`,
            data: event
        }).then(res => {
            console.log(res.data, "edited")
            dispatch(actionEditEvents(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionEditEvents = (event) => {
    return {
        type: Types.EDIT_EVENTS,
        payload: event
    }
}

/////// FETCH EVENTS
export const actionFetchEventsRequest = () => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: 'http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/all',
            data: null
        }).then(res => {
            dispatch(actionFetchEvents(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchEvents = (events) => {
    return {
        type: Types.FETCH_EVENTS,
        payload: events
    }
}

/////// FETCH EVENTS BY ID
export const actionFetchEventsByIDRequest = (eventId) => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/${eventId}`,
            data: null
        }).then(res => {
            console.log(res.data[0], "get by id")
            dispatch(actionFetchEventsByID(res.data[0]))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchEventsByID = (event) => {
    return {
        type: Types.FETCH_EVENTS_BY_ID,
        payload: event
    }
}

/////// FETCH EVENTS BY OWNER
export const actionFetchEventsByOwnerRequest = (ownerId) => {
    return async (dispatch) => {
        console.log(ownerId, "123")
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/account/${ownerId}/ownevent`,
            data: null
        }).then(res => {
            console.log(res.data, "get by owner")
            dispatch(actionFetchEventsByOwner(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchEventsByOwner = (events) => {
    return {
        type: Types.FETCH_EVENTS_BY_OWNER,
        payload: events
    }
}

/////// FETCH VOLUNTEERS BY EMAIL
export const actionFetchVolunteersByEmailRequest = (email) => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/volunteer/${email}`,
            data: null
        }).then(res => {
            console.log(res.data[0], "get by email")
            dispatch(actionFetchVolunteersByEmail(res.data[0]))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchVolunteersByEmail = (volunteer) => {
    return {
        type: Types.FETCH_VOLUNTEERS_BY_EMAIL,
        payload: volunteer
    }
}

/////// ADD VLOUNTEERS
export const actionAddVolunteersRequest = (volunteer) => {
    return async (dispatch) => {
        return axios({
            method: 'POST',
            url: 'http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/volunteer',
            data: volunteer
        }).then(res => {
            dispatch(actionAddVolunteers(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionAddVolunteers = (volunteer) => {
    return {
        type: Types.ADD_VOLUNTEERS,
        payload: volunteer
    }
}

/////// FETCH VOLUNTEERS
export const actionFetchVolunteersRequest = () => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: 'http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/volunteer/all',
            data: null
        }).then(res => {
            console.log(res.data, "get all volunteers")
            dispatch(actionFetchVolunteers(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchVolunteers = (volunteers) => {
    return {
        type: Types.FETCH_VOLUNTEERS,
        payload: volunteers
    }
}

/////// ADD SITE-VOLUNTEER
export const actionAddSiteVolunteerRequest = (volunteer) => {
    return async (dispatch) => {
        return axios({
            method: 'POST',
            url: 'http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/sitevolunteer',
            data: volunteer
        }).then(res => {
            dispatch(actionAddSiteVolunteer(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionAddSiteVolunteer = (volunteer) => {
    return {
        type: Types.ADD_SITE_VOLUNTEER,
        payload: volunteer
    }
}

/////// FETCH VOLUNTEERS BY SITE
export const actionFetchVolunteersBySiteRequest = (siteID) => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/${siteID}/volunteer`,
            data: null
        }).then(res => {
            console.log(res.data, "get by site id")
            dispatch(actionFetchVolunteersBySite(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchVolunteersBySite = (volunteersBySite) => {
    return {
        type: Types.FETCH_VOLUNTEERS_BY_SITE,
        payload: volunteersBySite
    }
}

/////// DOWNLOAD EVENTS BY ACCOUNT
export const actionDownloadEventsByAccountRequest = (accountId, accountName) => {
    return async (dispatch) => {
        console.log(accountId, "id")
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/account/${accountId}/ownevent/download`,
            data: null,
            responseType: 'blob'
        }).then(res => {
            console.log(res.data, "get events by id")
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${accountName} events.xlsx`);
            document.body.appendChild(link);
            link.click();
        }).catch(err => {
            console.log(err)
        })
    }
}

/////// DOWNLOAD VOLUNTEERS BY SITE
export const actionDownloadVolunteersBySiteRequest = (siteID, siteName) => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/${siteID}/volunteer/download`,
            data: null,
            responseType: 'blob'
        }).then(res => {
            console.log(res.data, "get volunteers by site")
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${siteName} volunteers.xlsx`);
            document.body.appendChild(link);
            link.click();
        }).catch(err => {
            console.log(err)
        })
    }
}

/////// SEND EMAIL VOLUNTEERS BY SITE
export const actionSendEmailVolunteersBySiteRequest = (siteID) => {
    return async (dispatch) => {
        return axios({
            method: 'POST',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/cleansite/${siteID}/mailvolunteer`,
            data: null,
        }).then(res => {
            console.log("Sent email to volunteers by site")
        }).catch(err => {
            console.log(err)
        })
    }
}

/////// FETCH ACCOUNT BY ID
export const actionFetchAccountsByIDRequest = (accountID) => {
    return async (dispatch) => {
        return axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/account/${accountID}`,
            data: null
        }).then(res => {
            console.log(res.data[0], "get by id")
            dispatch(actionFetchAccountsByID(res.data[0]))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionFetchAccountsByID = (account) => {
    return {
        type: Types.FETCH_ACCOUNTS_BY_ID,
        payload: account
    }
}

/////// EDIT ACCOUNT
export const actionEditAccountRequest = (acc, id) => {
    return async (dispatch) => {
        return axios({
            method: 'PUT',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/account/${id}`,
            data: acc
        }).then(res => {
            console.log(res.data, "edited")
            dispatch(actionEditAccount(res.data))
        }).catch(err => {
            console.log(err)
        })
    }
}
export const actionEditAccount = (acc) => {
    return {
        type: Types.EDIT_ACCOUNT,
        payload: acc
    }
}