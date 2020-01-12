import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { actionFetchEventsRequest, 
  actionDeleteEventsRequest, 
  actionFetchEventsByIDRequest,
  actionFetchEventsByOwnerRequest,
  actionFetchAccountsByIDRequest,
  actionDownloadEventsByAccountRequest,
  actionEditAccountRequest } from '../action/actions'
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
      emailNow: '',
      nameNow: '',
      descNow: '',
      passNow: '',
      photoNow: '',
      imagePreviewUrl: [],
      files: [],
      nameNew: '',
      descNew: '',
      photoNew: '',

      showEdit: false,

      keyword: '',
      filterCity: "",
      filterDistrict: "",
      filterTime: ""
    }
    this.closeModal = this.closeModal.bind(this)
    this.download = this.download.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.openEdit = this.openEdit.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.onChangeFilterCity = this.onChangeFilterCity.bind(this);
    this.onChangeFilterDistrict = this.onChangeFilterDistrict.bind(this);
    this.onChangeFilterTime = this.onChangeFilterTime.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
  }  

  componentDidMount() {

    const userToken = localStorage.getItem("usertoken")
    const socialType = localStorage.getItem("socialtype")


    if (typeof userToken !== "undefined" && userToken !== null) {
      var decoded = jwtDecode(userToken);
      const id = decoded.acc_id;
      const name = decoded.acc_username;
      const pass = decoded.acc_pass;
      const desc = decoded.acc_description;
      const email = decoded.acc_email;
      const photo = decoded.acc_profile_pic
      this.setState({idNow: id, emailNow: email, passNow: pass, nameNow: name, nameNew: name, descNew: desc, descNow: desc, photoNow: photo})
      if (decoded.acc_username == "admin") {
        this.props.fetchAccountByID(decoded.acc_id)
        this.props.actionFetchEvents()
      } else{
        this.props.fetchAccountByID(decoded.acc_id)
        this.props.fetchEventsByOwner(id)
        this.setState({ displayItems: this.props.events.events })
      }
    }
    else if (socialType == "facebook"){
        axios({
            method: 'GET',
            url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/sociallogin/fblogin`,
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
                url: `http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/sociallogin/gmaillogin`,
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

    } else {
      window.location.href="/#/sign-in"
    }
  }
  componentWillReceiveProps(props) {
    this.setState({ displayItems: props.events.events })
    this.setState({ nameNew: this.props.accounts.account.acc_username, descNew: this.props.accounts.account.acc_description})
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

  openEdit(e) {
    this.setState({
        showEdit: !this.state.showEdit
    })
  }

  onSubmit(e) {
    const obj = {
      acc_id: this.state.idNow,
      acc_username: this.state.nameNew,
      acc_description: this.state.descNew
    };
    this.props.actionEditAccount(obj, this.state.idNow)
  }

  fileSelectedHandler = (e) => {
    let reader = new FileReader();
    this.setState({
      files: [...e.target.files],
    })
    reader.readAsDataURL(e.target.files[0])
    this.state.imagePreviewUrl.pop()
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: [reader.result]
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

  fileUploadHandler = () => {
    if(this.state.files.length !== 0) {
      const fd = new FormData();
    fd.append('galleryImage', this.state.files[0], this.state.files[0].name)    
    axios.post(`http://cleanupvn.ap-northeast-1.elasticbeanstalk.com:3000/photo/profile/${this.state.idNow}/upload`, fd)
    .then(res => {
      console.log(res)
      this.onSubmit()
      window.location.reload()
  });
    } else {
      this.onSubmit()
      window.location.reload()
    }
  }

  handleNameChange(e) {
    this.setState({
      nameNew: e.target.value
    })
  }

  handleDescChange(e) {
    this.setState({
      descNew: e.target.value
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
            <img style={{backgroundSize: "cover", width: "200px", height: "200px"}} class="img-responsive" src={this.props.accounts.account.acc_profile_pic} />
            <br/>
            <div style={{ marginLeft: 'auto', marginRight: 'auto'}}>
            </div>
            
          </div>
          <div className='col'>
            <h3>{this.props.accounts.account.acc_username}</h3>
            <p>{this.props.accounts.account.acc_description}</p>
            <button className='btn btn-info btn-sm' onClick={this.openEdit} >Edit Profile</button>
          </div>
          {this.state.showEdit &&
            
            <div className='col-5'>
              <div id="formModal" className="  modalCSS" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div class="modal-content cardCSS">

                                    <div class="modal-header">
                                            <h5>Edit Your Info</h5>
                                        </div>
                                        <div className='modal-body'>
                                        <form action='#' id='book-form' className="{formStatus} needs-validation"
                                                onSubmit={this.fileUploadHandler}
                                                novalidate>
                                                  <div className='row'>
                                                    <div className='col-6'>
                                                      <div className="form-group">
                                                      <label>Organizer Name *</label>
                                                      <input type="text" className="col"
                                                          placeholder="abc@example.com"
                                                          className="form-control"
                                                          value={this.state.nameNew}
                                                          onChange={this.handleNameChange}
                                                          noValidate
                                                      />
                                                      {/* {this.state.emailErr &&
                                                          <span className='error'>Invalid Email!</span>} */}
                                                    </div>

                                                    <div className="form-group">
                                                      <label>Organizer Description *</label>
                                                      {/* <input type="text" className="col"
                                                          placeholder="abc@example.com"
                                                          className="form-control"
                                                          name='descNow'
                                                          value={this.state.descNew}
                                                          onChange={this.handleDescChange}
                                                          noValidate
                                                      /> */}
                                                      <textarea placeholder="tell everyone a bit about your event..."
                                                          className="form-control"
                                                          id="exampleFormControlTextarea1"
                                                          rows="3"
                                                          value={this.state.descNew}
                                                          onChange={this.handleDescChange}
                                                      >
                                                      </textarea>
                                                      {/* {this.state.emailErr &&
                                                          <span className='error'>Invalid Email!</span>} */}
                                                    </div>
                                                    </div>

                                                    <div className='col-6'>
                                                    <div className="form-group">
                                                      <label>Profile Picture *</label>
                                                      <input type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/jfif" onChange={this.fileSelectedHandler} />
                                                      <div className="imgPreview">
                                                      {this.state.imagePreviewUrl.map((url, index) =>
                                                        <div style={{ display: "inline-block" }}>
                                                          <div class="modal-dialog" >
                                                            <div class="modal-content">
                                                              <div class="modal-header">
                                                                <img style={{ backgroundSize: "cover", width: "100px", height: "100px" }} class="img-responsive" src={url} />
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
                                                      {/* {this.state.emailErr &&
                                                          <span className='error'>Invalid Email!</span>} */}
                                                    </div>
                                                  </div>


                                                  </div>

                                                  
                                                  

                                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                  <button className='btn btn-info' type="button" onClick={this.fileUploadHandler}>Save</button>
                                                  </div>
                                                  

                                                </form>
                                        </div>
                                    </div>
                                    </div>
                                    </div>
            </div>
          }
          

        </div>
        <br/><br/><br/><br/>
        <div className="pageTitle">List of Events &nbsp; <span><a style={{fontSize: "16px"}} href='/#/event-list' onClick={this.download}>Download your events</a></span></div>

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
                <td >{event.cs_address_name}</td>
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
    accounts: state.accounts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEventsById: (id) => { dispatch(actionFetchEventsByIDRequest(id)) },
    fetchEventsByOwner: (ownerid) => { dispatch(actionFetchEventsByOwnerRequest(ownerid)) },
    fetchAccountByID: (ownerID) => { dispatch(actionFetchAccountsByIDRequest(ownerID)) },
    actionDeleteEvents: (name) => { dispatch(actionDeleteEventsRequest(name)) },
    actionFetchEvents: () => { dispatch(actionFetchEventsRequest()) },
    actionDownloadEventsByAccount: (ownerid, ownername) => { dispatch(actionDownloadEventsByAccountRequest(ownerid, ownername)) },
    actionEditAccount: (obj, id) => { dispatch(actionEditAccountRequest(obj, id)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventListPage)