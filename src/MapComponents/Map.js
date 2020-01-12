/*global google*/
import React, { Component, useState, useRef } from 'react'
import { compose, withProps, withStateHandlers, lifecycle, shouldUpdate } from 'recompose'
import { Marker, GoogleMap, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps'
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer'
import SearchBox from './SearchBox'
import { actionFetchEventsRequest } from '../action/actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { bounce } from 'react-animations'
import styled, { keyframes } from 'styled-components'
import Pagination from './../pages/Pagination'
import './../css/style.css'

const Bounce = styled.div`animation: 2s ${keyframes`${bounce}`} infinite`

const Map = compose(
    withStateHandlers(() => ({
        isOpen: false,
        markerIndex: 0,
        display: []
    }), {
        onToggleOpen: ({ isOpen }) => (index, lat, lng) => ({
            isOpen: true,
            markerIndex: index,
            lat: lat,
            lng: lng
        }),
        onSearch: ({ isOpen }) => (displaySearch) => ({
            display: displaySearch
        }),
    },
    ),
    withScriptjs,
    withGoogleMap
)(props => {
    const mapRef = useRef(null)
    const [zoom, setZoom] = useState(9)
    const [marker, setMarker] = useState({ hasMarker: false, position: {} })
    const [center, setCenter] = useState({ lat: 10.777428, lng: 106.695448 })

    const zoomIn = (lat, lng) => {
        setZoom(16)
        setCenter({
            lat: lat,
            lng: lng
        })
    }

    const handlePlacesChanged = place => {
        setZoom(16)
        setCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        })
        setMarker({
            hasMarker: true,
            position: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            },
        })
    }
    return (
        <GoogleMap zoom={zoom}
            center={center}
            style={{ height: '75vh' }}>
            <Bounce>

                <SearchBox onPlacesChanged={handlePlacesChanged} /></Bounce>
            {marker.hasMarker}

            {/* <MarkerClusterer averageCenter
                enableRetinaIcons
                gridSize={30}> */}

                {props.display.map((point, index) => (
                    <Marker key={index}
                        animation={props ? (point.clean_site_id === props.markerIndex ? '1' : '0') : '0'}
                        position={{ lat: parseFloat(point.cs_lat), lng: parseFloat(point.cs_long) }}
                        onClick={() => { props.onToggleOpen(index) }}>

                        {props.isOpen && props.markerIndex === index &&
                            // point.clean_site_id === props.markerIndex &&
                            <InfoWindow onCloseClick={props.onToggleOpen} onPositionChanged={() => { zoomIn(parseFloat(point.cs_lat), parseFloat(point.cs_long)) }}>
                                <div className="infoWindow"  >
                                    {/* <h5>{point.cs_name} </h5> */}
                                    <h5 class="card-title">{point.cs_name} <span style={{ fontWeight: "normal", fontSize: "12px" }}>
                                        <a type="button" class="btn btn-lg btn-danger" data-toggle="popover" title={point.cs_owner_description} data-content="And here's some amazing content. It's very engaging. Right?" class="card-link" style={{ color: "black" }}>
                                            by {point.cs_owner_name}
                                        </a>
                                    </span></h5>
                                    <p style={{ fontSize: "15px" }}>{point.cs_address}</p>
                                    <Link to={`/event-detail/${point.clean_site_id}`}>See more...</Link>
                                </div>
                            </InfoWindow>
                        }
                    </Marker>
                ))}
            {/* </MarkerClusterer> */}
        </GoogleMap>
    )
}
);


class MapUI extends Component {
    constructor() {
        super();
        this.state = {
            isOpen: false,
            // events: [],
            // marker: "",

            displayItems: [],
            pageOfItems: [],

            keyword: '',
            organizerName: "",
            filterCity: "",
            filterDistrict: "",
            filterTime: ""
        }
        this.getDate = this.getDate.bind(this);
        this.getTime = this.getTime.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleOrganizerNameChange = this.handleOrganizerNameChange.bind(this);
        this.onChangeFilterCity = this.onChangeFilterCity.bind(this);
        this.onChangeFilterDistrict = this.onChangeFilterDistrict.bind(this);
        this.onChangeFilterTime = this.onChangeFilterTime.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.child = React.createRef();
    }

    componentDidMount = () => {
        this.props.actionFetchEvents();
        this.child.current.stateUpdaters.onSearch(this.props.events.events);
        this.setState({ displayItems: this.props.events.events })
    }

    componentWillReceiveProps = (props) => {
        this.child.current.stateUpdaters.onSearch(props.events.events);
        this.setState({ displayItems: props.events.events })
    }

    getDate(timestamp) {
        return new Date(timestamp).toDateString()
    }

    getTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString()
    }

    searchFunc(e) {
        if (this.state.filterTime == "Morning") {
            let array = this.props.events.events.filter(value =>
                value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
                && value.cs_owner_name.toLowerCase().includes(this.state.organizerName.toLowerCase())
                && value.cs_address.includes(this.state.filterDistrict)
                && value.cs_address.includes(this.state.filterCity)
                && new Date(value.cs_start_time).getHours() < 12)
            this.setState({ displayItems: array })
            this.child.current.stateUpdaters.onSearch(array);
        } else if (this.state.filterTime == "Afternoon") {
            let array = this.props.events.events.filter(value =>
                value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
                && value.cs_owner_name.toLowerCase().includes(this.state.organizerName.toLowerCase())
                && value.cs_address.includes(this.state.filterDistrict)
                && value.cs_address.includes(this.state.filterCity)
                && new Date(value.cs_start_time).getHours() < 17 && new Date(value.cs_start_time).getHours() >= 12)
            this.setState({ displayItems: array })
            this.child.current.stateUpdaters.onSearch(array);
        } else if (this.state.filterTime == "Evening") {
            let array = this.props.events.events.filter(value =>
                value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
                && value.cs_owner_name.toLowerCase().includes(this.state.organizerName.toLowerCase())
                && value.cs_address.includes(this.state.filterDistrict)
                && value.cs_address.includes(this.state.filterCity)
                && new Date(value.cs_start_time).getHours() < 21 && new Date(value.cs_start_time).getHours() >= 17)
            this.setState({ displayItems: array })
            this.child.current.stateUpdaters.onSearch(array);
        } else if (this.state.keyword == "" && this.state.filterCity == "" && this.state.filterDistrict == "" && this.state.filterTime == "" && this.state.organizerName == "") {
            this.setState({ displayItems: this.props.events.events })
            this.child.current.stateUpdaters.onSearch(this.props.events.events);
        } else if (this.state.filterTime == "") {
            let array = this.props.events.events.filter(value =>
                value.cs_name.toLowerCase().includes(this.state.keyword.toLowerCase())
                && value.cs_owner_name.toLowerCase().includes(this.state.organizerName.toLowerCase())
                && value.cs_address.includes(this.state.filterDistrict)
                && value.cs_address.includes(this.state.filterCity))
            this.setState({ displayItems: array })
            this.child.current.stateUpdaters.onSearch(array);

        }
        // this.child.current.stateUpdaters.onSearch(this.state.displayItems);
    }

    handleKeywordChange(e) {
        this.setState({
            keyword: e.target.value
        });
    }

    handleOrganizerNameChange(e) {
        this.setState({
            organizerName: e.target.value
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

    onChildClick = (index, lat, lng) => {
        this.child.current.stateUpdaters.onToggleOpen(index, lat, lng);
    }

    onChangePage(pageOfItems) {
        this.setState({ pageOfItems: pageOfItems });
    }

    render() {
        console.log(this.state, "state")
        return (
            <div className="App" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <br /><br /><br /><br /><br />

                <div className='container'>
                    <div className='row'>
                        <div className='col-4'>
                            <img src="https://160g7a3snajg2i1r662yjd5r-wpengine.netdna-ssl.com/wp-content/uploads/50th-logos-finished-blue-transparent-01.png" width="325vh" height="125vh" />
                            <br /><br />
                        </div>
                        <div className='col-8'>
                            Earth Day Clean Up is an annual event that aims for a beautiful and free of trash environment. Our final goal is to raise awareness about the litter & trash issue by educating people and being proactive in protecting the country from careless littering.
                            <br /><br />
                            All volunteers (including companies, universities, social organizations and individuals) will be provided the green T–shirts of ‘Viet Nam Sach & Xanh’ with our partners’ logos in order to create a consistent message in society about keeping Vietnam beautiful and free of littering.
                        </div>
                    </div>
                </div>

                <br />
                <div className="pageTitle">Clean Up Events Around You</div>
                <br />

                <div className="form-inline container searchCenter">

                    <input className="form-control mr-sm-2 "
                        type="search"
                        placeholder="Event name..."
                        value={this.state.keyword}
                        name="keyword"
                        onChange={this.handleKeywordChange}
                    />

                    <input className="form-control mr-sm-2 "
                        type="search"
                        placeholder="Organizer name..."
                        value={this.state.organizerName}
                        name="organizerName"
                        onChange={this.handleOrganizerNameChange}
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

                    <a href=''>
                        <button type="button" className="btn btn-danger btn-sm" >
                            Clear
                        </button>
                    </a>

                </div>

                <br />

                <div className="row">
                    <div className='col-1'>
                        <div>
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/Logo-WAVE.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/a1.-HCMC-US-Consulate-logo-high-ress.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/vespa-adventures.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/a2000px-Intel-logo.svgs_.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/RMIT_University_Logo.svg_.png" width="100%" height="100%" />
                        </div>

                    </div>
                    <div className="col-4">
                        {this.state.displayItems.length == 0 &&
                            <div>
                                <h6 className='container'>No events match your filters.</h6>
                            </div>
                        }
                        {this.state.displayItems.length !== 0 &&
                            <div>
                                {this.state.pageOfItems.map((event, index) =>
                                    <div style={{ paddingBottom: "10px" }}>
                                        <div className="card" onClick={() => this.onChildClick(index, event.cs_lat, event.cs_long)} >
                                            <div class="card-body">
                                                <h4 class="card-title">{event.cs_name} <span style={{ fontWeight: "normal", fontSize: "16px" }}>
                                                    <a type="button" class="btn btn-lg btn-danger" data-toggle="popover" title={event.cs_owner_description} data-content="And here's some amazing content. It's very engaging. Right?" class="card-link" style={{ color: "black" }}>
                                                        by {event.cs_owner_name}
                                                    </a>
                                                </span></h4>
                                                <h6 class="card-subtitle mb-2 text-muted">{this.getDate(event.cs_start_time)}, {this.getTime(event.cs_start_time)}</h6>
                                                <p style={{ fontSize: "16px" }}>{event.cs_address}</p>
                                                <a href={`/#/event-detail/${event.clean_site_id}`} class="card-link">See more...</a>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                <Pagination pageSize={3} initialPage={1} items={this.state.displayItems} onChangePage={this.onChangePage.bind(this)} />
                            </div>
                        }
                    </div>

                    <div className="col-6 container" >
                        <Map
                            ref={this.child}
                            events={this.props.events}
                            defaultOptions={{ scaleControl: true }}
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAbyEx4KJzCcJDrK_s-B4RaRMIrxceYSfQ&libraries=visualization,drawing,geometry,places`}
                            loadingElement={<div style={{ height: '100%' }}> Loading... </div>}
                            containerElement={<div style={{ height: '75vh' }} />}
                            mapElement={<div style={{ height: '100%' }} />}
                        />
                    </div>

                    <div className="col-1">
                        <div>
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/a1.-SSISs.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/aaAmChamss.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/heineken-vietnam-brewery-5a050226408b8.jpg" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/1.png" width="100%" height="100%" />
                            <br /><br /><br />
                            <img src="http://vietnamsachvaxanh.org/wp-content/uploads/asamsung_logo_PNG3s.png" width="100%" height="100%" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        actionFetchEvents: () => { dispatch(actionFetchEventsRequest()) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapUI)