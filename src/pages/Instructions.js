import React from 'react';
import './../css/style.css'

class AboutUS extends React.Component {

    render() {
        return (
            <div className="font App" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <br /><br /><br /><br /><br />
                <div className="pageTitle">Instructions</div>
                <br />
                <div className="row">
                    <div className="col-7">
                        <div className="container"></div>
                        <p className="container">
                            <h4>Join an Event</h4>
                            <p>
                                To be able to register for a clean up event, you need to fill in all the fields in the event detail page. New users will have to fill in some personal information. All events can be searched and selected <span><a href='/#/'>here</a></span>.
                            </p>
                            <br/>
                            <h4>Create an Event</h4>
                            <p>
                                To be able to create a clean up event, you need to be <span><a href='/#/sign-in'>logged in your account</a></span> first. You can create a new account for you <span><a href='/#/sign-up'>here</a></span>. Then select Create Event option on the navigation bar and you will be directed to the create event form. Fill in all the fields with valid information then submit and your event is ready to go.
                            </p>
                            <br/>
                            <h4>Edit & Delete an Event</h4>
                            <p>
                                After successfully created a clean up event, you are able to edit or delete it. Go to your <span><a href='/#/event-list'>event list page</a></span> and select an event. In your event detail page, a yellow button is for editing and a red button is for deleting your event.
                            </p>
                            
                        </p>
                    </div>
                    <div className="col-5">
                        <img src="http://vietnamsachvaxanh.org/wp-content/uploads/aDSC_0545s-300x199.jpg" style={{ width: "100%" }}></img>
                    </div>
                </div>
            </div>
        )
    }
}

export default (AboutUS)
