import React, { Component, useState } from 'react';
import { actionEditEventsRequest, actionFetchEventsByIDRequest } from '../action/actions'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './../css/style.css'
import MapForSetUpUI from '../MapComponents/MapForSetUp';
import axios from 'axios';
import {Modal, ModalBody} from 'reactstrap'
import { Link } from 'react-router-dom';


class EditLocationPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: '',
            eventName: '',
            eventLocationName: '',
            eventAdress: "",
            eventCoordLat: '',
            eventCoordLng: '',
            eventDescription: '',
            eventDataCollected: '',
            eventStartDateTime: this.get_7_days_after(),
            eventEndDateTime: this.get_7_days_after(),
            public: '',
            ownerID: '',
            eventNumParticipants: '',
            eventTrashWeight: '',
            eventRecyclableTrash: '',
            eventNonRecyclableTrash: '',
            eventOrganicTrash: '',
            eventToolReq: '',
            eventXSreq: '',
            eventSreq: '',
            eventMreq: '',
            eventLreq: '',
            eventXLreq: '',
            eventPay: false,

            notify: false,
            nameErr: false,
            descErr: false,
            coordErr: false,
            timeErr: false,
            publicErr: false,
            locationNameErr: false
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleLocationNameChange = this.handleLocationNameChange.bind(this)
        this.handleCoordChange = this.handleCoordChange.bind(this)
        this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this)
        this.handleEndDateTimeChange = this.handleEndDateTimeChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleDataCollectedChange = this.handleDataCollectedChange.bind(this)
        this.public = this.public.bind(this)
        this.nopublic = this.nopublic.bind(this)
    }

    handleNameChange(e) {
        this.setState({
            eventName: e.target.value
        });
    }

    handleLocationNameChange(e) {
        this.setState({
            eventLocationName: e.target.value
        });
    }

    handleCoordChange() {
        this.setState({
            eventCoordLat: this.childData.lat,
            eventCoordLng: this.childData.lng
        });
    }

    handleStartDateTimeChange = (e) => {
        this.setState({
            eventStartDateTime: e,
            eventEndDateTime: e
        })
    }

    handleEndDateTimeChange = (e) => {
        this.setState({
            eventEndDateTime: e
        });
    }

    handleDescriptionChange(e) {
        this.setState({
            eventDescription: e.target.value
        });
    }

    handleDataCollectedChange(e) {
        this.setState({
            eventDataCollected: e.target.value
        });
    }

    public() {
        this.setState({
            public: "true"
        })
    }

    nopublic() {
        this.setState({
            public: "false"
        })
    }

    get_end_of_date = () => {
        var date = new Date();
        date.setHours(23);
        return date;
    }

    get_7_days_after = () => {
        var date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    }

    get_24_hours_before = () => {
        var date = this.state.eventEndDateTime;
        date.setDate(date.getHours);
        return date;
    }

    callBackFunc = (childData) => {
        console.log("called from parent")
        this.setState({ eventCoordLat: childData.lat, eventCoordLng: childData.lng, eventAdress: childData.address })
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            //   id: this.state.id,
            clean_site_id: this.state.eventId,
            cs_name: this.state.eventName,
            cs_address_name: this.state.eventLocationName,
            cs_address: this.state.eventAdress.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            cs_lat: this.state.eventCoordLat,
            cs_long: this.state.eventCoordLng,
            cs_agenda: this.state.eventDescription,
            cs_start_time: this.state.eventStartDateTime,
            cs_end_time: this.state.eventEndDateTime,
            cs_ptcp_no: this.state.eventNumParticipants,
            cs_amount_collected: this.state.eventTrashWeight,
            cs_recy: this.state.eventRecyclableTrash,
            cs_non_recy: this.state.eventNonRecyclableTrash,
            cs_organic: this.state.eventOrganicTrash,
            cs_rq_set: this.state.eventToolReq,
            cs_xs_shirt: this.state.eventXSreq,
            cs_s_shirt: this.state.eventSreq,
            cs_m_shirt: this.state.eventMreq,
            cs_l_shirt: this.state.cs_l_shirt,
            cs_xl_shirt: this.state.eventXLreq,
            cs_inex: this.state.eventInEx,
            cs_pay: this.state.eventPay
        };
        if (this.state.eventName === "") {
            console.log("check name")
          this.setState({
                nameErr: true,
                descErr: false,
                coordErr: false,
                timeErr: false,
                locationNameErr: false,
                publicErr: false
          })
        } else if (this.state.eventDescription === "") {
            console.log("check desc")
            this.setState({
                nameErr: false,
                descErr: true,
                coordErr: false,
                timeErr: false,
                locationNameErr: false,
                publicErr: false
            })
        } else if (this.state.eventStartDateTime.getDate() == this.state.eventEndDateTime.getDate() 
                    && this.state.eventStartDateTime.getTime() >= this.state.eventEndDateTime.getTime() ) {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: false,
                timeErr: true,
                locationNameErr: false,
                publicErr: false
            })
        } else if (this.state.eventLocationName === "") {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: false,
                locationNameErr: true,
                timeErr: false,
                publicErr: false
            })
        } else if (this.state.eventCoordLat === "" || this.state.eventCoordLng === "") {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: true,
                timeErr: false,
                locationNameErr: false,
                publicErr: false
            })
        } else if (this.state.public === "") {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: false,
                timeErr: false,
                locationNameErr: false,
                publicErr: true
            })
        } else {
            this.props.actionEditEvents(obj, this.state.eventId)
            this.setState({
                eventName: "",
                eventAdress: "",
                eventCoordLat: "",
                eventCoordLng: "",
                eventDescription: "",
                eventEndDateTime: "",
                eventStartDateTime: "",
                eventDataCollected: "",
                eventLocationName:"",
                notify: true,
            })
        }
    }

    componentDidMount() {
        const userToken = localStorage.getItem("usertoken")
        if (typeof userToken !== "undefined" && userToken !== null) {
            var { match } = this.props
            console.log(this.props)
            if (match) {
                var eventID = match.params.eventID
                console.log(eventID)
                axios({
                    method: 'GET',
                    url: `http://localhost:8081/cleansite/${eventID}`,
                    data: null
                }).then(res => {
                    console.log(res.data, "data")
                    var data = res.data[0]
                    this.setState({
                        eventId: data.clean_site_id,
                        eventName: data.cs_name,
                        eventLocationName: data.cs_address_name,
                        eventAddress: data.cs_address,
                        eventDescription: data.cs_agenda, 
                        eventStartDateTime: new Date(data.cs_start_time),
                        eventEndDateTime: new Date(data.cs_end_time),
                        eventNumParticipants: data.cs_ptcp_no,
                        eventTrashWeight: data.cs_amount_collected,
                        eventRecyclableTrash: data.cs_recy,
                        eventNonRecyclableTrash: data.cs_non_recy,
                        eventOrganicTrash: data.cs_organic,
                        eventToolReq: data.cs_rq_set,
                        eventXSreq: data.cs_xs_shirt,
                        eventSreq: data.cs_s_shirt,
                        eventMreq: data.cs_m_shirt,
                        eventLreq: data.cs_l_shirt,
                        eventXLreq: data.cs_xl_shirt,
                        eventInEx: data.cs_inex,
                        eventPay: Boolean(data.cs_pay)
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        } else {
            window.location.href = "/#/sign-in"
        }
    }



    render() {
        console.log(this.state, "state")
        return (
            <div className="App" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <br /><br /><br /><br /><br />
                <Modal isOpen={this.state.notify}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Successfully edited!</h5></ModalBody>
                        <ModalBody>
                            <Link to={`/event-list`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button className="btn btn-success btn-sm">
                                    Back to List page
                                </button>
                            </Link>
                        </ModalBody>
                    </Modal>
                <div className="pageTitle">Edit event</div>
                <br />
                <form action='#' id='book-form' className="{formStatus} needs-validation" onSubmit={this.onSubmit} novalidate>
                    <div className="row">
                        <div className="col-6">
                            
                            <div className="form-group">
                                <label>Event Name *</label>
                                <input type="text" className="col"
                                    placeholder="name..."
                                    className="form-control"
                                    value={this.state.eventName}
                                    onChange={this.handleNameChange}
                                />
                                {this.state.nameErr && 
                                        <span className='error'>Please fill in this field!</span>}
                            </div>

                            {/* text area for notes */}
                            <div class="form-group">
                                <label>Agenda *</label>
                                <textarea placeholder="tell everyone a bit about your event..."
                                    class="form-control"
                                    id="exampleFormControlTextarea1"
                                    rows="14"
                                    value={this.state.eventDescription}
                                    onChange={this.handleDescriptionChange}
                                >
                                </textarea>
                                {this.state.descErr && 
                                    <span className='error'>Please fill in this field!</span>}
                            </div>

                            {/* Date & Time picker */}
                            <div className="row">
                                <div className="col">
                                    <label>Start Date / Time *</label>
                                    <div className="form-group">
                                        <DatePicker
                                            className='form-control'
                                            selected={this.state.eventStartDateTime}
                                            minDate={this.get_7_days_after()}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={30}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            timeCaption="Time"
                                            onSelect={this.handleSelect}
                                            placeholderText="date - time"
                                            onChange={this.handleStartDateTimeChange}
                                        />
                                    </div>
                                </div>
                                
                                <div className="col">
                                    <label>End Date / Time *</label>
                                    <div className="form-group">
                                        <DatePicker
                                            className='form-control'
                                            selected={this.state.eventEndDateTime}
                                            minDate={this.state.eventStartDateTime}
                                            // minTime={this.state.eventStartDateTime}
                                            // maxTime={this.get_end_of_date()}
                                            showTimeSelect
                                            excludeOutOfBoundsTimes
                                            // excludeTimes={this.state.disableSlots}
                                            timeFormat="HH:mm"
                                            timeIntervals={30}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            timeCaption="time"
                                            onSelect={this.handleSelect}
                                            placeholderText="date - time"
                                            onChange={this.handleEndDateTimeChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {this.state.timeErr && 
                                    <span className='error'>Invalid end time!</span>}
                        </div>

                        <br />

                        <div className="col-6">
                            <div className="form-group">
                                <label>Location Name *</label>
                                <input type="text" className="col"
                                    placeholder="location name..."
                                    className="form-control"
                                    value={this.state.eventLocationName}
                                    onChange={this.handleLocationNameChange}
                                />
                                {this.state.locationNameErr &&
                                    <span className='error'>Please fill in this field!</span>}
                            </div>
                            <label>Location *</label>
                            <div>
                                <MapForSetUpUI history={this.callBackFunc} onChange={this.handleCoordChanges} />
                                {this.state.coordErr && 
                                        <span className='error'>Please choose your location!</span>}
                            </div>

                            <br/>

                            <div>
                                <label>Public this event? *</label>
                                <div className="form-group">
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" 
                                                id="customRadio1" 
                                                name="customRadio" 
                                                class="custom-control-input"
                                                value={this.state.public} 
                                                // checked={this.public}  
                                                onChange={this.public}
                                                />
                                        <label class="custom-control-label" for="customRadio1">Yes</label>
                                    </div>
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" 
                                                id="customRadio2" 
                                                name="customRadio" 
                                                class="custom-control-input"
                                                value={this.state.public} 
                                                // checked={this.nopublic} 
                                                onChange={this.nopublic}
                                                />
                                        <label class="custom-control-label" for="customRadio2">No</label>
                                    </div>
                                </div>
                            </div>
                            {this.state.publicErr &&
                                        <span className='error'>Please choose an option!</span>}

                        </div>

                        <br />

                    </div>

                    <br />
                    <br />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                        <button className="btn btnColor btn-lg" type="submit" on>Change</button>
                    </div>

                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchEventsById: (id) => { dispatch(actionFetchEventsByIDRequest(id)) },
        actionEditEvents: (obj, id) => { dispatch(actionEditEventsRequest(obj, id)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLocationPage)