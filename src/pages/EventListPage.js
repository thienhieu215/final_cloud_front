import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { actionFetchEventsRequest, 
  actionDeleteEventsRequest, 
  actionFetchEventsByIDRequest,
  actionFetchEventsByOwnerRequest,
  actionFetchAccountsByIDRequest,
  actionDownloadEventsByAccountRequest } from '../action/actions'
import { Link } from 'react-router-dom';
import {Modal,ModalHeader,ModalBody} from 'reactstrap'
import jwtDecode from 'jwt-decode'
import Cryptr from 'cryptr'
const cryptr = new Cryptr('myTotalySecretKey');





class EventListPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayItems: [],
      readytodeleteEvent: '',
      notify: false,
      idNow: '',
      nameNow: '',
      descNow: '',
      photoNow: '',

      keyword: '',
      filterCity: "",
      filterDistrict: "",
      filterTime: ""
    }
    this.closeModal = this.closeModal.bind(this)
    this.download = this.download.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.onChangeFilterCity = this.onChangeFilterCity.bind(this);
    this.onChangeFilterDistrict = this.onChangeFilterDistrict.bind(this);
    this.onChangeFilterTime = this.onChangeFilterTime.bind(this);
  }

  componentDidMount() {

    const userToken = localStorage.getItem("usertoken")
    const socialType = localStorage.getItem("socialtype")


    if (typeof userToken !== "undefined" && userToken !== null) {
      var decoded = jwtDecode(userToken);
      const id = decoded.acc_id;
      const name = decoded.acc_username;
      const desc = decoded.acc_description;
      const photo = decoded.acc_profile_pic
      this.setState({idNow: id, nameNow: name, descNow: desc, photoNow: photo})
      if (decoded.acc_username == "admin") {
        this.props.actionFetchEvents()
      } else{
        this.props.fetchEventsByOwner(id)
        this.setState({ displayItems: this.props.events.events })
      }
    }
    else if (socialType == "facebook"){
        axios({
            method: 'GET',
            url: `http://localhost:3000/sociallogin/fblogin`,
            data: null
        })
            .then(res => {
                if (res.data != "Not authenticated") {
                    var decoded = jwtDecode(res.data);
                    console.log("YOU CAN DO THISS")
                    console.log(decoded)
                    const id = decoded.user_id;
                    const name = decoded.user_name;
                    // const desc = decoded.acc_description;
                    // const photo = decoded.acc_profile_pic
                    this.setState({idNow: id, nameNow: name})
                    this.props.fetchEventsByOwner(id)
                    this.setState({ displayItems: this.props.events.events })
                }
                else {  window.location.href="/#/sign-in"}
            })
            .catch(err => {
                console.log(err)
            })
    }
    else if (socialType == "gmail"){
            axios({
                method: 'GET',
                url: `http://localhost:3000/sociallogin/gmaillogin`,
                data: null
            })
                .then(res => {
                    if (res.data['authorization'] == "true") {
                        var decoded = jwtDecode(res.data.token);
                        console.log("YOU CAN DO THISS AGAIN")
                        console.log(decoded)
                        const id = decoded.user_id;
                        const name = decoded.user_name;
                        // const desc = decoded.acc_description;
                        // const photo = decoded.acc_profile_pic
                        this.setState({idNow: id, nameNow: name})
                        this.props.fetchEventsByOwner(id)
                        this.setState({ displayItems: this.props.events.events })
                    }
                    else {  window.location.href="/#/sign-in"}
                })
                .catch(err => {
                    console.log(err)
                })

    }
  }
  componentWillReceiveProps(props) {
    this.setState({ displayItems: props.events.events })
  }


deleteBooking(name) {
  this.props.actionDeleteEvents(name)
  this.setState({notify: false})
}

  //get date from timestamp 
  getDate(timestamp) {
    return new Date(timestamp).toDateString()
    // return new Date(timestamp).getDate()
  }

  //get time from timestamp
  getTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString()
    // return new Date(timestamp).getTime()
  }

  closeModal() {
    this.setState({notify: false})
  }

  openModal = (a) =>{
    this.setState({
      notify: true,
      readytodeleteEvent: a
    })
  }

  download() {
    this.props.actionDownloadEventsByAccount(this.state.idNow, this.state.nameNow)
  }

  searchFunc(e) {
    // If the search bar isn't empty
    if (this.state.filterTime == "Morning") {
      let array = this.props.events.events.filter(value => value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
          && value.cs_address.includes(this.state.filterDistrict)
          && value.cs_address.includes(this.state.filterCity)
          && new Date(value.cs_start_time).getHours() < 12)
      this.setState({ displayItems: array })
    } else if (this.state.filterTime == "Afternoon") {
        let array = this.props.events.events.filter(value => value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
          && value.cs_address.includes(this.state.filterDistrict)
          && value.cs_address.includes(this.state.filterCity)
          && new Date(value.cs_start_time).getHours() < 17 && new Date(value.cs_start_time).getHours() >=12)
        this.setState({ displayItems: array })
    } else if (this.state.filterTime == "Evening") {
        let array = this.props.events.events.filter(value => value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
          && value.cs_address.includes(this.state.filterDistrict)
          && value.cs_address.includes(this.state.filterCity)
          && new Date(value.cs_start_time).getHours() < 21 && new Date(value.cs_start_time).getHours() >=17)
        this.setState({ displayItems: array })
    } else if (this.state.keyword == "" && this.state.filterCity == "" && this.state.filterDistrict == "" && this.state.filterTime == "") {
        this.setState({ displayItems: this.props.events.events })
    } else if (this.state.filterTime == "") {
        let array = this.props.events.events.filter(value => value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
          && value.cs_address.includes(this.state.filterDistrict)
          && value.cs_address.includes(this.state.filterCity))
        this.setState({ displayItems: array })
    }
  }

  handleChange(e) {
      this.setState({
          keyword: e.target.value
      });
  }

  onChangeFilterCity(e) {
      this.setState({
          filterCity: e.target.value
      })
  }

  onChangeFilterDistrict(e) {
      this.setState({
          filterDistrict: e.target.value
      })
  }

  onChangeFilterTime(e) {
      this.setState({
          filterTime: e.target.value
      })
  }

  render() {
    console.log(this.state, "state")
    return (
      <div className="tableMargin App Min-height" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
        <br /><br /><br /><br /><br />
        <Modal isOpen={this.state.notify}>
          <ModalBody><h5 style={{ display: 'flex', alignItems: "left", justifyContent: 'left' }}>Are you sure you want to delete this event?</h5></ModalBody>
            <ModalBody style={{ display: "flex" ,justifyContent: "flex-end" }}>
              <Link>
                <button className="btn btn-danger btn-sm" onClick={() => {this.deleteBooking(this.state.readytodeleteEvent)} }>
                  Yes
                </button>
              </Link>
                                
                &nbsp;    
                
              <button type="button" className="btn btn-secondary btn-sm" onClick={this.closeModal} >
                  Cancel
              </button>
            </ModalBody>
          </Modal>
        <div className='row'>
          <div className='col-2'>
            <img style={{backgroundSize: "cover", width: "200px", height: "200px"}} class="img-responsive" src={this.state.photoNow} />
          </div>
          <div className='col-8'>
            <h3>{this.state.nameNow}</h3>
            <p>{this.state.descNow}</p>
          </div>
        </div>
        <br/>
        <div className="pageTitle">List of Events</div>
        <br/>
        <a href='/#/event-list' onClick={this.download}>Download your events</a>
        <br/>
        {this.state.nameNow == "admin" && 
        <div className="form-inline searchCenter">

                    <input className="form-control mr-sm-2 "
                        type="search"
                        placeholder="Event name..."
                        value={this.state.keyword}
                        name="keyword"
                        onChange={this.handleChange}
                    />

                    <div class="form-row align-items-center">
                        <div class="col-auto my-1">
                            <select class="custom-select mr-sm-2"
                                value={this.state.filterCity}
                                onChange={this.onChangeFilterCity}>
                                <option selected value="">City...</option>
                                <option>Ho Chi Minh</option>    <option>Ha Noi</option> <option>Ba Ria - Vung Tau</option>  <option>Da Nang</option>
                                <option>Can Tho</option>   <option>An Giang</option>    <option>Bac Giang</option>  <option>Bac Kan</option>    <option>Bac Lieu</option>
                                <option>Bac Ninh</option>  <option>Ben Tre</option>     <option>Binh Dinh</option>    <option>Binh Duong</option>
                                <option>Binh Phuoc</option>  <option>Binh Thuan</option>    <option>Ca Mau</option>  <option>Cao Bang</option>
                                <option>Dak Lak</option>    <option>Dak Nong</option>  <option>Dien Bien</option>   <option>Dong Nai</option>
                                <option>Dong Thap</option>  <option>Gia Lai</option>    <option>Ha Giang</option>   <option>Ha Nam</option>
                                <option>Ha Tinh</option>    <option>Hai Duong</option>  <option>Hai Phong</option>    <option>Hau Giang</option>
                                <option>Hoa Binh</option>   <option>Hung Yen</option>  <option>Khanh Hoa</option>
                                <option>Kien Giang</option>  <option>Kon Tum</option>   <option>Lai Chau</option>  <option>Lam Dong</option>
                                <option>Lang Son</option>  <option>Lao Cai</option>     <option>Long An</option>    <option>Nam Dinh</option>
                                <option>Nghe An</option>    <option>Ninh Binh</option>  <option>Ninh Thuan</option>  <option>Phu Tho</option>
                                <option>Phu Yen</option>    <option>Quang Binh</option>     <option>Quang Nam</option>    <option>Quang Ngai</option>
                                <option>Quang Ninh</option>  <option>Quang Tri</option>     <option>Soc Trang</option>    <option>Son La</option>
                                <option>Tay Ninh</option>      <option>Thai Binh</option>   <option>Thai Nguyen</option>    <option>Thanh Hoa</option>
                                <option>Thua Thien Hue</option>  <option>Tien Giang</option>    <option>Tra Vinh</option>  <option>Tuyen Quang</option>
                                <option>Vinh Long</option>    <option>Vinh Phuc</option>    <option>Yen Bai</option>
                            </select>
                        </div>

                        <div class="col-auto my-1">
                            {this.state.filterCity == "" &&
                                <select class="custom-select mr-sm-2"
                                    id="inlineFormCustomSelect"
                                    value={this.state.filterDistrict}
                                    onChange={this.onChangeFilterDistrict}>
                                    <option selected value="">District...</option>
                                </select>
                            }
                            {this.state.filterCity.toLowerCase() == "ho chi minh" &&
                                <select class="custom-select mr-sm-2"
                                    id="inlineFormCustomSelect"
                                    value={this.state.filterDistrict}
                                    onChange={this.onChangeFilterDistrict}>
                                    <option selected value="">District...</option>
                                    <option>Quan 1</option>    <option>Quan 2</option>  <option>Quan 3</option>    <option>Quan 4</option>
                                    <option>Quan 5</option>    <option>Quan 6</option>  <option>Quan 7</option>    <option>Quan 8</option>
                                    <option>Quan 9</option>    <option>Quan 10</option> <option>Quan 11</option>   <option>Quan 12</option>
                                    <option>Binh Tan</option>  <option>Binh Thanh</option>   <option>Go Vap</option>       <option>Phu Nhuan</option>
                                    <option>Tan Binh</option>  <option>Tan Phu</option> <option>Thu Duc</option>    <option>Binh Chanh</option>
                                    <option>Can Gio</option>      <option>Cu Chi</option>   <option>Hoc Mon</option>    <option>Nha Be</option>
                                </select>
                            }
                            {this.state.filterCity.toLowerCase() == "ha noi" &&
                                <select class="custom-select mr-sm-2"
                                    id="inlineFormCustomSelect"
                                    value={this.state.filterDistrict}
                                    onChange={this.onChangeFilterDistrict}>
                                    <option selected>District...</option>
                                    <option>Ba Dinh</option>    <option>Hoan Kiem</option>  <option>Hai Ba Trung</option>    <option>Dong Da</option>
                                    <option>Cau Giay</option>    <option>Long Bien</option>  <option>Hoang Mai</option>    <option>Soc Son</option>
                                    <option>Bac Tu Liem</option>    <option>Thanh Tri</option> <option>Gia Lam</option>   <option>Ba Vi</option>
                                    <option>Chuong My</option>  <option>Dan Phuong</option>   <option>Hoai Duc</option>       <option>My Duc</option>
                                    <option>Phu Xuyen</option>  <option>Phu Tho</option> <option>Quoc Oai</option>    <option>Thach That</option>
                                    <option>Thanh Oai</option>      <option>Thuong Tin</option>   <option>Ung Hoa</option>    <option>Me Linh</option>
                                    <option>Ha Dong</option>    <option>Son Tay</option>    <option>Dong Anh</option>   <option>Nam Tu Liem</option>
                                    <option>Thanh Xuan</option>    <option>Tay Ho</option>
                                </select>
                            }
                        </div>

                        <div class="col-auto my-1">
                            <select class="custom-select mr-sm-2" 
                                    id="inlineFormCustomSelect"
                                    value={this.state.filterTime}
                                    onChange={this.onChangeFilterTime}>
                                <option selected value="">Time...</option>
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                            </select>
                        </div>
                    </div>

                    <button className="btn searchBtn my-2 my-sm-0 col-md-1"
                            onClick={this.searchFunc.bind(this)}>
                        <img className="kinhlup" src="https://www.stickpng.com/assets/images/585e4ae9cb11b227491c3394.png" width="27px" height="30px" alt="No Logo" />
                    </button>
                </div>
                }
        <br/>
        <table className="table table-hover tableColor">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" style={{ width: "200px" }}>Name</th>
              <th scope="col" style={{ width: "350px" }}>Date / Time</th>
              <th scope="col" style={{ width: "250px" }}>Location</th>
              <th scope="col" style={{ width: "350px" }}>Address</th>
              {this.state.nameNow == 'admin' && <th scope="col">Action</th>}
              <th scope="col">Publicity</th>
            </tr>
          </thead>
          <tbody>
            {this.state.displayItems.map((event, index) =>
              <tr key={index} >
                <td >{index + 1}</td>
                {this.state.nameNow !== 'admin' && 
                  <td ><Link style={{fontWeight: "500", color:"black"}} to={`/event-detail-owner/${event.clean_site_id}` }>{event.cs_name}</Link></td>
                }
                {this.state.nameNow == 'admin' && 
                  <td ><Link style={{fontWeight: "500", color:"black"}} to={`/event-detail-admin/${event.clean_site_id}` }>{event.cs_name}</Link></td>
                }
                <td >{this.getDate(event.cs_start_time)}, {this.getTime(event.cs_start_time)}-{this.getTime(event.cs_end_time)}</td>
                <td >{this.getTime(event.cs_end_time)}, {this.getDate(event.cs_end_time)}</td>
                <td >{event.cs_address}</td>
                {this.state.nameNow == 'admin' && 
                <td>
                <Link to={`/edit-event/${event.clean_site_id}`}>
                  <button type="button" className="btn btn-warning btn-sm" >
                    Edit
                  </button>
                </Link>

                &nbsp;    
                
                <button type="button" className="btn btn-danger btn-sm" 
                onClick={() => {this.openModal(event.clean_site_id)} }>
                    Delete
                </button>
                </td>
                }
                <td >{event.cs_inex}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEventsById: (id) => { dispatch(actionFetchEventsByIDRequest(id)) },
    fetchEventsByOwner: (ownerid) => { dispatch(actionFetchEventsByOwnerRequest(ownerid)) },
    fetchAccountBySite: (ownerID) => { dispatch(actionFetchAccountsByIDRequest(ownerID)) },
    actionDeleteEvents: (name) => { dispatch(actionDeleteEventsRequest(name)) },
    actionFetchEvents: () => { dispatch(actionFetchEventsRequest()) },
    actionDownloadEventsByAccount: (ownerid, ownername) => { dispatch(actionDownloadEventsByAccountRequest(ownerid, ownername)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListPage)