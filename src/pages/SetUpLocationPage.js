import React, { Component } from 'react';
import { actionAddEventsRequest } from '../action/actions'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './../css/style.css'
import MapForSetUpUI from '../MapComponents/MapForSetUp';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode'
import "./../css/customDatePickerWidth.css"
import SearchBox from './../MapComponents/SearchBox'
import { FusionTablesLayer } from 'react-google-maps';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class SetUpLocationPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventLocationName: '',
            eventAdress: "",
            eventCoordLat: '',
            eventCoordLng: '',
            eventDescription: '',
            eventStartDateTime: this.get_7_days_after(),
            eventEndDateTime: this.get_7_days_after(),
            public: 'public',
            ownerID: '',

            notify: false,
            showInternal: false,
            token: '',
            tokenName: '',
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

    public(e) {
        this.setState({
            showInternal: false,
            public: e.target.value
        })
    }

    nopublic(e) {
        this.setState({
            showInternal: true,
            public: e.target.value
        })
    }

    callBackFunc = (childData) => {
        console.log("called from parent")
        this.setState({ eventCoordLat: childData.lat, eventCoordLng: childData.lng, eventAdress: childData.address })
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            cs_name: this.state.eventName,
            cs_address_name: this.state.eventLocationName,
            cs_address: this.state.eventAdress.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            cs_lat: this.state.eventCoordLat,
            cs_long: this.state.eventCoordLng,
            cs_agenda: this.state.eventDescription,
            cs_start_time: this.state.eventStartDateTime,
            cs_end_time: this.state.eventEndDateTime,
            cs_owner: this.state.token,
            cs_owner_name: this.state.tokenName,
            cs_inex: this.state.public
        };
        if (this.state.eventName === "") {
            this.setState({
                nameErr: true,
                descErr: false,
                coordErr: false,
                timeErr: false,
                locationNameErr: false,
                publicErr: false
            })
        } else if (this.state.eventDescription === "") {
            this.setState({
                nameErr: false,
                descErr: true,
                coordErr: false,
                timeErr: false,
                locationNameErr: false,
                publicErr: false
            })
        } else if (this.state.eventStartDateTime.getDate() == this.state.eventEndDateTime.getDate()
            && this.state.eventStartDateTime.getTime() >= this.state.eventEndDateTime.getTime()) {
            this.setState({
                nameErr: false,
                descErr: false,
                locationNameErr: false,
                coordErr: false,
                timeErr: true,
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
        } else if (this.state.public === "public") {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: false,
                timeErr: false,
                publicErr: true,
                locationNameErr: false,
            })
        }
        //after passing all validations
        else {
            this.setState({
                nameErr: false,
                descErr: false,
                coordErr: false,
                timeErr: false,
                publicErr: false,
                locationNameErr: false,
            })
            this.props.actionAddEvents(obj)
            this.setState({
                eventName: "",
                eventAdress: "",
                eventCoordLat: "",
                eventCoordLng: "",
                eventDescription: "",
                eventEndDateTime: "",
                eventStartDateTime: "",
                notify: true,
            })
        }
    }

    componentDidMount() {
        const userToken = localStorage.getItem("usertoken")
        if (typeof userToken !== "undefined" && userToken !== null) {
            var decoded = jwtDecode(userToken);
            const id = decoded.acc_id;
            this.setState({ token: decoded.acc_id, tokenName: decoded.acc_username })
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
                    <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Event successfully created!</h5></ModalBody>
                    <ModalBody>
                        <Link to={`/event-list`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button className="btn btn-success btn-sm">
                                Go to List Page
                                </button>
                        </Link>
                    </ModalBody>
                </Modal>
                <div className="pageTitle">Create New Event</div>
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

                            <div className="row">
                                <div className="col">
                                    <label>Start Date / Time *</label>
                                    <div className="form-group customDatePickerWidth">
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
                                            placeholderText="date / time"
                                            onChange={this.handleStartDateTimeChange}
                                        />
                                    </div>
                                </div>

                                <div className="col">
                                    <label>End Date / Time of Event *</label>
                                    <div className="form-group customDatePickerWidth">
                                        <DatePicker
                                            className='form-control'
                                            selected={this.state.eventEndDateTime}
                                            minDate={this.state.eventStartDateTime}
                                            maxDate={this.state.eventStartDateTime}
                                            showTimeSelect
                                            excludeOutOfBoundsTimes
                                            timeFormat="HH:mm"
                                            timeIntervals={30}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            timeCaption="time"
                                            onSelect={this.handleSelect}
                                            placeholderText="date / time"
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

                            <div>
                                <label>Location Address *</label>
                                <div>
                                    <MapForSetUpUI history={this.callBackFunc} onChange={this.handleCoordChanges} />
                                    {this.state.coordErr &&
                                        <span className='error'>Please choose your location!</span>}
                                </div>
                            </div>

                            <br />

                            <div>
                                <label>External or Internal event? *</label>
                                <div className="form-group">
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio"
                                            id="customRadio1"
                                            name="customRadio"
                                            class="custom-control-input"
                                            value=''
                                            onChange={this.public}
                                        />
                                        <label class="custom-control-label" for="customRadio1">External</label>
                                    </div>
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio"
                                            id="customRadio2"
                                            name="customRadio"
                                            class="custom-control-input"
                                            value={this.state.public}
                                            onChange={this.nopublic}
                                        />
                                        <label class="custom-control-label" for="customRadio2">Internal</label>
                                    </div>
                                    {this.state.showInternal && 
                                        <div className="form-group">
                                        <label>Email domain name *</label>
                                        <input type="text" className="col"
                                            placeholder="domain name..."
                                            className="form-control"
                                            onChange={this.nopublic}
                                        />
                                        {this.state.nameErr &&
                                            <span className='error'>Please fill in this field!</span>}
                                    </div>
                                    }
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
                        <button className="btn btnColor btn-lg" type="submit" on>Create</button>
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
        actionAddEvents: (obj) => { dispatch(actionAddEventsRequest(obj)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUpLocationPage)