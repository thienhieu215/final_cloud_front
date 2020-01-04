import React, { Component, useState, useRef } from 'react'
import { compose, withProps, withStateHandlers } from 'recompose'
import {
    Marker,
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    InfoWindow
} from 'react-google-maps'
import SearchBox from './SearchBox'


const MapForSetUp = compose(

    withStateHandlers(() => ({
        isOpen: false,
        markerIndex: 0
    }), {
        onToggleOpen: ({ isOpen }) => (index) => ({
            isOpen: !isOpen,
            markerIndex: index
        })
    }),
    
    withScriptjs,
    withGoogleMap
)(props => {
    const [marker, setMarker] = useState({ hasMarker: false, position: {} })
    const [center, setCenter] = useState({ lat: 10.729572, lng: 106.693748 })
    
    const handlePlacesChanged = place => {
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
        props.handleCall({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
        })
    }

    
    return (
        
        <GoogleMap
            defaultZoom={14}
            center={center}
        >
            <SearchBox onPlacesChanged={handlePlacesChanged} />
            {marker.hasMarker && <Marker position={marker.position} />}
        </GoogleMap>
    )
}
);



class MapForSetUpUI extends Component {

    constructor() {
        super();
        this.state = {
            isOpen: false
        }
        this.onToggleOpen = this.onToggleOpen.bind(this);
    }

    onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    parentCall = (data) => {
        console.log(data, "hjhj");
        this.props.history(data);
    }
    
    render() {
        return (
            <div className="container">
                <MapForSetUp
                    handleCall = {this.parentCall}
                    defaultOptions={{ scaleControl: true }}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAbyEx4KJzCcJDrK_s-B4RaRMIrxceYSfQ&libraries=visualization,drawing,geometry,places`}
                    loadingElement={<div style={{ height: '100%' }}> Loading... </div>}
                    containerElement={<div style={{ height: '48vh', width: '100%' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                />
            </div>

        )
    }
}

export default MapForSetUpUI