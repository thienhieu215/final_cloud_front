import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    actionFetchEventsByIDRequest,
    actionFetchVolunteersByEmailRequest,
    actionAddSiteVolunteerRequest,
    actionAddVolunteersRequest,
    actionFetchVolunteersRequest,
    actionFetchVolunteersBySiteRequest,
    actionDownloadVolunteersBySiteRequest
} from '../action/actions'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Link } from 'react-router-dom';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class EventDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: '',
            eventName: '',
            eventAddress: '',
            eventDescription: '',
            eventStartDateTime: '',
            eventEndDateTime: '',
            eventLat: '',
            eventLng: '',
            eventDomain: '',
            eventDataCollected: '',
            eventOwner: '',
            ownerPhoto: '',
            eventPhoto: '',

            vltEmail: '',
            vltName: '',
            vltDOB: '',
            vltAddress: '',
            tools: '',
            tool: false,
            showSize: false,
            shirt: '',

            account: [],

            showForm: false,
            notify: false,
            notify2: false,
            emailErr: false
        }
        this.handleVolunteerEmailChange = this.handleVolunteerEmailChange.bind(this)
        this.handleVolunteerNameChange = this.handleVolunteerNameChange.bind(this)
        this.handleVolunteerAddressChange = this.handleVolunteerAddressChange.bind(this)
        this.handleVolunteerDOBChange = this.handleVolunteerDOBChange.bind(this)
        this.handleToolsChange = this.handleToolsChange.bind(this)
        this.handleShirtChange = this.handleShirtChange.bind(this)
        this.handleSizeChange = this.handleSizeChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.toggleOpenForm = this.toggleOpenForm.bind(this)
    }

    handleVolunteerEmailChange(e) {
        this.setState({
            vltEmail: e.target.value
        });
    }

    handleVolunteerNameChange(e) {
        this.setState({
            vltName: e.target.value
        });
    }

    handleVolunteerAddressChange(e) {
        this.setState({
            vltAddress: e.target.value
        });
    }

    handleVolunteerDOBChange(e) {
        this.setState({
            vltDOB: e
        });
    }

    handleToolsChange(e) {
        this.setState({
            tool: !this.state.tool
        });
    }

    handleShirtChange(e) {
        this.setState({
            showSize: !this.state.showSize
        });
    }

    handleSizeChange(e) {
        this.setState({
            shirt: e.target.value
        });
    }

    componentDidMount() {
        this.props.actionFetchVolunteers()
        this.setState({ account: this.props.volunteers.volunteers })
        var { match } = this.props
        if (match) {
            var eventID = match.params.eventID
            this.props.fetchVolunteerBySite(eventID)
            axios({
                method: 'GET',
                url: `http://localhost:8081/cleansite/${eventID}`,
                data: null
            }).then(res => {
                var data = res.data[0]
                axios({
                    method: 'GET',
                    url: `http://localhost:8081/photo/owner/${data.cs_owner}/photo`,
                    data: null
                }).then(res => {
                    this.setState({
                        ownerPhoto: res.data
                    })
                }).catch(err => {
                    console.log(err)
                })

                axios({
                    method: 'GET',
                    url: `http://localhost:8081/photo/site/${eventID}/photo`,
                    data: null
                }).then(res => {
                    this.setState({
                        eventPhoto: res.data
                    })
                }).catch(err => {
                    console.log(err)
                })

                this.setState({
                    eventId: data.clean_site_id,
                    eventName: data.cs_name,
                    eventAddress: data.cs_address,
                    eventDescription: data.cs_description,
                    eventStartDateTime: data.cs_start_time,
                    eventEndDateTime: data.cs_end_time,
                    eventLat: data.cs_lat,
                    eventLng: data.cs_long,
                    eventDataCollected: data.cs_amount_collected,
                    eventOwner: data.cs_owner,
                    eventDomain: data.cs_inex
                })
            }).catch(err => {
                console.log(err)
            })
        }


    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            sv_site: this.state.eventId,
            sv_volunteer: this.state.vltEmail,
            sv_cleanuptools: this.state.tool,
            sv_shirt: this.state.shirt
        }
        const obj1 = {
            vlt_name: this.state.vltName,
            vlt_email: this.state.vltEmail,
            vlt_dob: this.state.vltDOB,
            vlt_address: this.state.vltAddress
        }
        if (this.state.vltEmail === "" || validEmailRegex.test(this.state.vltEmail) === false || !this.state.vltEmail.includes(this.state.eventDomain)) {
            this.setState({
                emailErr: true,
            })
        } else {
            this.setState({
                emailErr: false,
            })
            if (this.state.showForm == false) {
                var count = 0
                for (let i = 0; i < this.props.volunteers.volunteers.length; i++) {     //Chay nguyen cai volunteer
                    if (this.props.volunteers.volunteers[i].vlt_email == this.state.vltEmail) {
                        count += 1  //So vlt email voi tat ca mail, neu co
                        if (this.props.volunteers.volunteersBySite.length == 0) {   //Neu site chua co ai
                            this.props.actionAddSiteVolunteer(obj)
                            this.setState({
                                vltEmail: ""
                            })
                            this.setState({ notify: true })
                            console.log("added old volunteer to event 11")
                        }
                        else {
                            for (let k = 0; k < this.props.volunteers.volunteersBySite.length; k++) { // Neu site co
                                console.log(this.props.volunteers.volunteersBySite[k])
                                if (this.props.volunteers.volunteersBySite[k].vlt_email == this.state.vltEmail) {
                                    console.log("this volunteer already registered this site")
                                    this.setState({ notify2: true })
                                    break
                                }
                                this.props.actionAddSiteVolunteer(obj)
                                this.setState({
                                    vltEmail: ""
                                })
                                console.log("added old volunteer to event")
                                this.setState({ notify: true })
                                break
                            }
                        }
                    }

                }
                console.log(count)
                if (count == 0) {
                    console.log("open form")
                    this.setState({ showForm: !this.state.showForm })
                }
            }
            if (this.state.showForm == true) {
                this.props.actionAddVolunteers(obj1)
                this.props.actionAddSiteVolunteer(obj)
                console.log("added new volunteer")
                this.setState({ notify: true })
            }
        }
    }

    toggleOpenForm = (bool) => {
        this.setState({
            showForm: !this.state.showForm
        });
    }

    //func to get 100 years before today
    get_100_years = () => {
        var date = new Date();
        date.setDate(date.getDate() - 36500);
        return date;
    }

    //get date from timestamp 
    getDate(timestamp) {
        return new Date(timestamp).toLocaleDateString()
    }

    //get time from timestamp
    getTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString()
    }

    closeModal() {
        this.setState({ notify2: false })
    }


    render() {
        console.log(this.state.ownerPhoto, "photo")
        return (
            <div className="Min-height" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <div className="container font" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                    <br /><br /><br /><br /><br />
                    <Modal isOpen={this.state.notify}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Successfully registered for this event. Thank you!</h5></ModalBody>
                        <ModalBody>
                            <Link to={`/`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button className="btn btn-success btn-sm">
                                    Back to Homepage
                                </button>
                            </Link>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.notify2}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>You have already registered for this event!</h5></ModalBody>
                        <ModalBody>

                            <button className="btn btn-success btn-sm"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={this.closeModal}>
                                Confirm
                                </button>
                        </ModalBody>
                    </Modal>
                    <div className="row" style={{ backgroundColor: "rgb(250, 250, 250)" }}>

                        <div className="col-7" >
                            <h1 className="">{this.state.eventName}</h1>
                            <br />
                            <div style={{ fontSize: "18px" }}>{this.state.eventAddress}</div>
                            <a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${this.state.eventLat},${this.state.eventLng}`}>See location on Google Maps</a>
                            <br /><br />
                            <hr className="hr"></hr> <br />
                            <div style={{ fontSize: "18px", fontWeight: "500" }}> Event Time:</div>
                            <div className="AppSmall">
                                Date: {this.getDate(this.state.eventStartDateTime)}
                            </div>
                            <div className="AppSmall">
                                Time: {this.getTime(this.state.eventStartDateTime)} - {this.getTime(this.state.eventEndDateTime)}
                            </div>
                            <br />
                            <div style={{ fontSize: "18px", fontWeight: "500" }}>Agenda: </div>
                            <div className="AppSmall">{this.state.eventDescription}</div> <br />

                            {this.state.eventDataCollected !== "unknown" &&
                                <div>
                                    <div style={{ fontSize: "18px", fontWeight: "500" }}>Report: </div>
                                    <div className="AppSmall">{this.state.eventDataCollected}</div> <br />
                                </div>

                            }

                            {this.state.ownerPhoto.length !== 0 &&
                                <div>
                                    <label style={{ fontSize: "18px", fontWeight: "500" }}>Photo of organizer or clean-up activities before</label>
                                    <br />
                                    {this.state.ownerPhoto.map((url, index) =>
                                        <div style={{ display: "inline-block" }}>
                                            <div class="modal-dialog" >
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <img style={{ backgroundSize: "cover", width: "50px", height: "50px" }} class="img-responsive" src={url.p_url} />

                                                    </div>
                                                </div>
                                            </div>
                                            &nbsp;
                                    </div>
                                    )}
                                </div>

                            }

                            {this.state.eventPhoto.length !== 0 &&
                                <div>
                                    <label style={{ fontSize: "18px", fontWeight: "500" }}>Photo of this event</label>
                                    <br />
                                    {this.state.eventPhoto.map((url, index) =>
                                        <div style={{ display: "inline-block" }}>
                                            <div class="modal-dialog" >
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <img style={{ backgroundSize: "cover", width: "50px", height: "50px" }} class="img-responsive" src={url.p_url} />

                                                    </div>
                                                </div>
                                            </div>
                                            &nbsp;
                                    </div>
                                    )}
                                </div>
                            }
                        </div>

                        <br /><br /><br />

                        <div className="col-5" >
                            <div id="formModal" className="  modalCSS" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div class="modal-content cardCSS">

                                        <div class="modal-header">
                                            {this.state.showForm &&
                                                <h5>First time joining events of Vietnam Sach & Xanh?
                                                    Tell us a little bit about you!</h5>}
                                            {this.state.showForm == false &&
                                                <h5 class="modal-title">Let's join the Clean Up!</h5>}
                                        </div>

                                        <div className='modal-body'>
                                            <form action='#' id='book-form' className="{formStatus} needs-validation"
                                                onSubmit={this.onSubmit}
                                                novalidate>

                                                <div className="form-group">
                                                    <label>Email *</label>
                                                    <input type="text" className="col"
                                                        placeholder="abc@example.com"
                                                        className="form-control"
                                                        name='vltEmail'
                                                        value={this.state.vltEmail}
                                                        onChange={this.handleVolunteerEmailChange}
                                                        noValidate
                                                    />
                                                    {this.state.emailErr &&
                                                        <span className='error'>Invalid Email!</span>}
                                                </div>

                                                {this.state.showForm &&
                                                    <div>

                                                        <div className="form-group">
                                                            <label>Full Name *</label>
                                                            <input type="text" className="col"
                                                                placeholder="name..."
                                                                className="form-control"
                                                                value={this.state.vltName}
                                                                onChange={this.handleVolunteerNameChange}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label>D.O.B *</label>
                                                            <div className="form-group">
                                                                <DatePicker
                                                                    className='form-control'
                                                                    selected={this.state.vltDOB}
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    dateFormat="MMMM d, yyyy"
                                                                    placeholderText="dd/mm/yy"
                                                                    minDate={this.get_100_years()}
                                                                    maxDate={new Date()}
                                                                    onChange={this.handleVolunteerDOBChange}
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="form-group">
                                                            <label>Address *</label>
                                                            <input type="text" className="col"
                                                                placeholder="address..."
                                                                className="form-control"
                                                                value={this.state.vltAddress}
                                                                onChange={this.handleVolunteerAddressChange}
                                                            />
                                                        </div>

                                                    </div>
                                                }

                                                <div className="form-group">
                                                    <label>Do you want to buy any clean-up tools? (optional)</label>
                                                    <div class="custom-control custom-checkbox">
                                                        <input class="custom-control-input" type="checkbox" id="inlineCheckbox1" value='Clean up tools' onChange={this.handleToolsChange} />
                                                        <label class="custom-control-label" for="inlineCheckbox1">Clean up tools</label>
                                                    </div>
                                                    <div class="custom-control custom-checkbox">
                                                        <input class="custom-control-input" type="checkbox" id="inlineCheckbox2" value='T-shirt' onChange={this.handleShirtChange} />
                                                        <label class="custom-control-label" for="inlineCheckbox2">T-shirt</label>
                                                    </div>
                                                    {this.state.showSize &&
                                                        <div style={{ width: '100px' }}>
                                                            <select class="custom-select mr-sm-2"
                                                                id="inlineFormCustomSelect"
                                                                value={this.state.shirt}
                                                                onChange={this.handleSizeChange}>
                                                                <option selected value="">Size...</option>
                                                                <option>XS</option>
                                                                <option>S</option>
                                                                <option>M</option>
                                                                <option>L</option>
                                                                <option>XL</option>
                                                            </select>
                                                        </div>
                                                    }

                                                </div>

                                                <br />
                                                <br />

                                                <button className="btn btnColor btn-lg btn-block" type="submit" on>
                                                    Join
                                                </button>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        event: state.event,
        volunteers: state.volunteers,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEventsById: (id) => { dispatch(actionFetchEventsByIDRequest(id)) },
        fetchVolunteerByEmail: (email) => { dispatch(actionFetchVolunteersByEmailRequest(email)) },
        fetchVolunteerBySite: (siteID) => { dispatch(actionFetchVolunteersBySiteRequest(siteID)) },
        actionAddSiteVolunteer: (obj) => { dispatch(actionAddSiteVolunteerRequest(obj)) },
        actionAddVolunteers: (obj) => { dispatch(actionAddVolunteersRequest(obj)) },
        actionFetchVolunteers: () => { dispatch(actionFetchVolunteersRequest()) },
        actionDownloadVolunteersBySite: (siteid, sitename) => { dispatch(actionDownloadVolunteersBySiteRequest(siteid, sitename)) },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailPage)
