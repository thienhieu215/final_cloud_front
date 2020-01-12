import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MapUI from '../MapComponents/Map';
import setUpLocation from '../pages/SetUpLocationPage'
import eventDetailPage from '../pages/EventDetailPage'
import eventDetailPageOwner from '../pages/EventDetailPageOwner'
import eventDetailPageAdmin from '../pages/EventDetailPageAdmin'
import signIn from '../pages/SignIn'
import signUp from '../pages/SignUp'
import aboutUs from '../pages/AboutUs'
import eventListPage from '../pages/EventListPage'
import editLocationPage from '../pages/EditLocationPage'
import instructions from '../pages/Instructions'


class Routes extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={MapUI} />
        <Route path="/create-event" component={setUpLocation} />
        <Route path="/event-detail/:eventID" component={eventDetailPage} />
        <Route path="/event-detail-owner/:eventID" component={eventDetailPageOwner} />
        <Route path="/event-detail-admin/:eventID" component={eventDetailPageAdmin} />
        <Route path="/sign-in" component={signIn} />
        <Route path="/sign-up" component={signUp} />
        <Route path="/about-us" component={aboutUs} />
        <Route path="/event-list/" component={eventListPage} />
        <Route path="/edit-event/:eventID" component={editLocationPage} />
        <Route path="/instructions" component={instructions} />
      </Switch>
    );
  }

}

export default Routes;