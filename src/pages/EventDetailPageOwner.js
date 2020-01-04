import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    actionEditEventsRequest,
    actionDeleteEventsRequest,
    actionFetchEventsByIDRequest,
    actionFetchVolunteersByEmailRequest,
    actionAddSiteVolunteerRequest,
    actionAddVolunteersRequest,
    actionFetchVolunteersRequest,
    actionFetchVolunteersBySiteRequest,
    actionDownloadVolunteersBySiteRequest
} from '../action/actions'
import { Link } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import jwtDecode from 'jwt-decode'


class EventDetailPageOwner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: '',
            eventName: '',
            eventLocationName: '',
            eventAddress: '',
            eventLat: '',
            eventLng: '',
            eventDescription: '',
            eventStartDateTime: '',
            eventEndDateTime: '',
            eventInEx: '',
            eventDataCollected: '',
            eventNumParticipants: '',
            eventParticipants: [],
            eventTrashWeight: '',
            eventRecyclableTrash: '',
            eventNonRecyclableTrash: '',
            eventOrganicTrash: '',
            file: '',
            imagePreviewUrl: [],
            files: [],
            eventToolReq: '',
            eventXSreq: '',
            eventSreq: '',
            eventMreq: '',
            eventLreq: '',
            eventXLreq: '',
            eventPay: true,

            vltEmail: '',
            vltName: '',
            vltDOB: '',
            vltAddress: '',



            account: [],
            tokenId: '',
            tokenName: '',

            showForm: false,

            notify: false,
            notify2: false,
            notify3: false,
            errorNum: false,
            errorWeight: false


        }
        // this.onSubmit = this.onSubmit.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.toggleOpenForm = this.toggleOpenForm.bind(this)
        this.download = this.download.bind(this)
        this.handleeventNumParticipantsChange = this.handleeventNumParticipantsChange.bind(this)
        this.handleeventTrashWeightChange = this.handleeventTrashWeightChange.bind(this)
        this.showResultForm = this.showResultForm.bind(this)
        this.closeForm = this.closeForm.bind(this)
        this.removePreview = this.removePreview.bind(this)
        this.handleeventRecyclableTrashChange = this.handleeventRecyclableTrashChange.bind(this)
        this.handleeventNonRecyclableTrashChange = this.handleeventNonRecyclableTrashChange.bind(this)
        this.handleeventOrganicTrashChange = this.handleeventOrganicTrashChange.bind(this)
    }

    handleeventNumParticipantsChange(e) {
        let recent = this.state.eventParticipants
        if (this.state.eventParticipants.length == 0) {
            this.setState({
                eventParticipants: [...this.state.eventParticipants, e.target.value],
            })
        } else {
            for (let i = 0; i < this.state.eventParticipants.length; i++) {
                if (this.state.eventParticipants[i] == e.target.value) {
                    recent.splice(i, 1)
                    this.setState({
                        eventParticipants: recent,
                    })
                } else {
                    this.setState({
                        eventParticipants: [...this.state.eventParticipants, e.target.value],
                    })
                }
            }
        }
    }

    handleeventTrashWeightChange(e) {
        this.setState({
            eventTrashWeight: e.target.value
        });
    }

    handleeventRecyclableTrashChange(e) {
        this.setState({
            eventRecyclableTrash: e.target.value
        });
    }

    handleeventNonRecyclableTrashChange(e) {
        this.setState({
            eventNonRecyclableTrash: e.target.value
        });
    }

    handleeventOrganicTrashChange(e) {
        this.setState({
            eventOrganicTrash: e.target.value
        });
    }

    componentDidMount() {
        const userToken = localStorage.getItem("usertoken")
        if (typeof userToken !== "undefined" && userToken !== null) {
            var decoded = jwtDecode(userToken);
            this.setState({ account: this.props.volunteers.volunteers, tokenName: decoded.acc_username, tokenId: decoded.acc_id })
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
                    this.setState({
                        eventId: data.clean_site_id,
                        eventName: data.cs_name,
                        eventLocationName: data.cs_address_name,
                        eventAddress: data.cs_address,
                        eventDescription: data.cs_agenda,
                        eventStartDateTime: data.cs_start_time,
                        eventEndDateTime: data.cs_end_time,
                        eventLat: data.cs_lat,
                        eventLng: data.cs_long,
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
                        eventPay: data.cs_pay
                    })
                }).catch(err => {
                    console.log(err)
                })
            }
        } else {
            window.location.href = "/#/sign-in"
        }
    }

    toggleOpenForm = (bool) => {
        this.setState({
            showForm: !this.state.showForm,
            eventNumParticipants: this.state.eventParticipants.length.toString()
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
        this.setState({ notify: false })
    }

    download() {
        this.props.actionDownloadVolunteersBySite(this.state.eventId, this.state.eventName)
    }

    deleteBooking(name) {
        this.props.actionDeleteEvents(name)
        this.setState({ notify: false })
        this.setState({ notify2: true })
    }

    openModal = () => {
        this.setState({
            notify: true,
        })
    }

    showResultForm = () => {
        this.setState({
            showForm: true,
        })
    }

    closeForm = () => {
        this.setState({
            showForm: false,
        })
    }

    close = () => {
        window.location.reload()
    }

    fileSelectedHandler = (e) => {
        this.setState({
            files: [...this.state.files, ...e.target.files],
        })
        for (let i = 0; i < e.target.files.length; i++) {
            this.addPreview(e.target.files[i])  
        }
    }

    addPreview(a) {
        let reader = new FileReader();
        reader.readAsDataURL(a)
        reader.onloadend = () => {
            this.setState({
                imagePreviewUrl: this.state.imagePreviewUrl.concat(reader.result)
            })
        }
    }

    removePreview(e) {
        let recent = this.state.files
        let recent2 = this.state.imagePreviewUrl
        recent.splice(e, 1)
        recent2.splice(e, 1)
        this.setState({
            files: recent,
            imagePreviewUrl: recent2
        })
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            clean_site_id: this.state.eventId,
            cs_name: this.state.eventName,
            cs_address_name: this.state.eventLocationName,
            cs_address: this.state.eventAddress,
            cs_lat: this.state.eventCoordLat,
            cs_long: this.state.eventCoordLng,
            cs_agenda: this.state.eventDescription,
            cs_start_time: this.state.eventStartDateTime,
            cs_end_time: this.state.eventEndDateTime,
            cs_inex: this.state.eventInEx,
            cs_ptcp_no: this.state.eventParticipants.length.toString(),
            cs_amount_collected: this.state.eventTrashWeight,
            cs_organic: this.state.eventOrganicTrash,
            cs_recy: this.state.eventRecyclableTrash,
            cs_non_recy: this.state.eventNonRecyclableTrash,
            cs_xs_shirt: this.state.eventXSreq,
            cs_s_shirt: this.state.eventSreq,
            cs_m_shirt: this.state.eventMreq,
            cs_l_shirt: this.state.eventLreq,
            cs_xl_shirt: this.state.eventXLreq,
            cs_rq_set: this.state.eventToolReq
        };
        if (this.state.eventParticipants.length == 0) {
          this.setState({
                errorNum: true,
                errorWeight: false
          })
        } else if (this.state.eventTrashWeight === "unknown") {
            console.log("check desc")
            this.setState({
                errorNum: false,
                errorWeight: true
            })
        } 
        else {
            const fd = new FormData();
            for (let i = 0; i < this.state.files.length; i++) {
                fd.append('galleryImage', this.state.files[i], this.state.files[i].name)
            }
            axios.post(`http://localhost:8081/photo/basic/${this.state.tokenId}/${this.state.eventId}/upload`, fd)
                .then(res => {
                    console.log(res)
                });
            this.props.actionEditEvents(obj, this.state.eventId)
            this.setState({
                notify3: true
            })
        }
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('image')
        axios.post(`localhost:8081/photo/basic/${this.state.tokenId}/${this.state.eventId}/upload`);
    }

    pay() {
        this.setState({
            eventPay: true
        })
    }


    render() {
        console.log(this.state, "state")
        return (
            <div className="Min-height" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <div className="container font" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                    <br /><br /><br /><br /><br />

                    <Modal isOpen={this.state.notify}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: "left", justifyContent: 'left' }}>Are you sure you want to delete this event?</h5></ModalBody>
                        <ModalBody style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Link>
                                <button className="btn btn-danger btn-sm" onClick={() => { this.deleteBooking(this.state.eventId) }}>
                                    Yes
                                </button>
                            </Link>
                            &nbsp;
                            <button type="button" className="btn btn-secondary btn-sm" onClick={this.closeModal} >
                                Cancel
                            </button>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.notify2}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Event deleted!</h5></ModalBody>
                        <ModalBody>
                            <Link to={`/event-list`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button className="btn btn-success btn-sm">
                                    Back to List Page
                                    </button>
                            </Link>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.notify3}>
                        <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Result Submitted!</h5></ModalBody>
                        <ModalBody>
                            <a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button onClick={this.close} type="button" className="btn btn-success btn-sm" >
                                    OK
                                    </button>
                            </a>
                        </ModalBody>
                    </Modal>

                    <div className="row" style={{ backgroundColor: "rgb(250, 250, 250)" }}>

                        <div className="col-7" >
                            <h1>{this.state.eventName}</h1>
                            <div style={{ fontSize: "18px" }}>{this.state.eventAddress}</div>
                            <a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${this.state.eventLat},${this.state.eventLng}`}>See location on Google Maps</a>
                            <br /><br />
                            <hr className="hr"></hr>
                            <br />
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

                            <div style={{ fontSize: "18px", fontWeight: "500" }}>Report: </div>
                            <div className="AppSmall">{this.state.eventDataCollected}</div> <br />

                            <br /><br /><br />

                            {/* {this.state.eventNumParticipants == 'unknown' && */}
                            <button type="button" className="btn btn-secondary btn-sm"
                                onClick={this.showResultForm}>
                                Fill in the result
                            </button>
                            {/* } */}

                            &nbsp;
    
                        <Link to={`/edit-event/${this.state.eventId}`}>
                                <button type="button" className="btn btn-warning btn-sm" >
                                    Edit this event
                            </button>
                            </Link>

                            &nbsp;
    
                        <button type="button" className="btn btn-danger btn-sm"
                                onClick={() => { this.openModal() }}>
                                Delete this event
                        </button>

                        </div>

                        <div className="col-5">
                            <div>
                                <h5 class="modal-title">List of registered volunteers</h5>
                                {this.props.volunteers.volunteersBySite.map((volunteer, index) =>
                                    <div>{volunteer.vlt_name} - {volunteer.vlt_email}</div>
                                )}
                                <br />
                                <a href={`/#/event-detail-owner/${this.state.eventId}`} onClick={this.download}>Download list of volunteers</a>
                            </div>

                            <br /><br />

                            <div>
                                <h5 class="modal-title">Tools Requirements</h5>
                                <br />
                                <h6>Tool kits: {this.state.eventToolReq}</h6>
                                <h6>Shirts: </h6>
                                <div>XS: {this.state.eventXSreq}</div>
                                <div>S: {this.state.eventSreq}</div>
                                <div>M: {this.state.eventMreq}</div>
                                <div>L: {this.state.eventLreq}</div>
                                <div>XL: {this.state.eventXLreq}</div>
                            </div>
                            <button type="button" className="btn btn-danger btn-sm"
                                onClick={() => { this.pay() }}>
                                Change Tool Requirements
                            </button>

                        </div>

                    </div>

                    <br />

                    {this.state.showForm &&

                        <div className='modal-body'>
                            <h3>Result of event</h3>
                            <br />
                            <form action='#' id='book-form' className="{formStatus} needs-validation"
                                onSubmit={this.onSubmit}
                                novalidate>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Number of participants *</label>
                                            {this.props.volunteers.volunteersBySite.map((volunteer, index) =>
                                                <div class="custom-control custom-checkbox">
                                                    <input class="custom-control-input" type="checkbox" id={index} value={volunteer.vlt_email} onChange={this.handleeventNumParticipantsChange} />
                                                    <label class="custom-control-label" for={index}>{volunteer.vlt_name} - {volunteer.vlt_email}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Weight of trash has been collected *</label>
                                            <input type="text" className="col"
                                                placeholder="kilograms..."
                                                className="form-control"
                                                value={this.state.eventTrashWeight}
                                                onChange={this.handleeventTrashWeightChange}
                                            />
                                            {this.state.errorWeight &&
                                                <span className='error'>Invalid Email!</span>}
                                        </div>
                                    </div>
                                </div>

                                <br />
                                <h5>Number of every pieces of trash</h5>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Recyclable *</label>
                                            <input type="text" className="col"
                                                placeholder="number..."
                                                className="form-control"
                                                name='vltEmail'
                                                // value={this.state.eventRecyclableTrash}
                                                onChange={this.handleeventRecyclableTrashChange}
                                                noValidate
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Organic *</label>
                                            <input type="text" className="col"
                                                placeholder="number..."
                                                className="form-control"
                                                name='vltEmail'
                                                // value={this.state.eventOrganicTrash}
                                                onChange={this.handleeventOrganicTrashChange}
                                                noValidate
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Non-Recyclable *</label>
                                            <input type="text" className="col"
                                                placeholder="kilograms..."
                                                className="form-control"
                                                // value={this.state.eventNonRecyclableTrash}
                                                onChange={this.handleeventNonRecyclableTrashChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>

                                    <br />
                                    <h5>Event Photos *</h5>

                                    <div>
                                        <br />
                                        <input style={{ display: "none" }}
                                            type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/jfif"
                                            multiple
                                            onChange={this.fileSelectedHandler}
                                            ref={fileInput => this.fileInput = fileInput} />
                                        <button onClick={() => this.fileInput.click()}>Import photos</button>
                                    </div>

                                    <div className="imgPreview">
                                        {this.state.imagePreviewUrl.map((url, index) =>
                                            <div style={{ display: "inline-block" }}>
                                                <div class="modal-dialog" >
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <img style={{ backgroundSize: "cover", width: "50px", height: "50px" }} class="img-responsive" src={url} />
                                                            <button type="button" class="close"
                                                                onClick={() => { this.removePreview(index) }}
                                                                style={{ fontSize: "20px" }}>&times;</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                &nbsp;
                                                                </div>
                                        )}
                                    </div>
                                </div>

                                <br />
                                <br />

                                <button className="btn btnColor btn-lg btn-block" type="submit" on>
                                    Submit Result
                                                </button>

                            </form>
                        </div>
                    }

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
        actionDeleteEvents: (name) => { dispatch(actionDeleteEventsRequest(name)) },
        actionEditEvents: (obj, id) => { dispatch(actionEditEventsRequest(obj, id)) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailPageOwner)