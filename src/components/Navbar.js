import React, { Component } from 'react';
import './../css/style.css';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import jwtDecode from 'jwt-decode'
import { actionFetchAccountsByIDRequest } from '../action/actions'


class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            switch: false
        }
        this.signOut = this.signOut.bind(this)
        this.signIn = this.signIn.bind(this)
    }

    componentDidMount() {
        const userToken = localStorage.getItem("usertoken")
        this.setState({ token: userToken })
        if (typeof userToken !== "undefined" && userToken !== null) {
            var decoded = jwtDecode(userToken);
            this.props.fetchAccountByID(decoded.acc_id)
            this.setState({ name: decoded.acc_username })
        }
    }

    signOut() {
        this.setState({ switch: false, name: '' })
        localStorage.removeItem('usertoken')
        window.location.href = '/#/'
        window.location.reload()
    }

    signIn() {
        this.setState({ switch: true })
    }

    render() {
        return (
            <div className="fixed-top" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="#">
                        <img src="svx-logo.png" width="150" height="50" alt=""></img>
                    </a>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav nav-item active mr-auto mt-2 mt-lg-0">
                        </ul>
                        <div className=" navbar-nav my-2 my-lg-0">
                            <ul className="navbar-nav">
                                <Button className="nav-link navFontColor" href="#/" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                    Map of Events
                            </Button>
                            </ul>
                            <ul className="navbar-nav">
                                <Button className="nav-link navFontColor" href="#/about-us" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                    About Us
                            </Button>
                            </ul>
                            {typeof this.state.name == 'undefined' &&
                                <ul className="navbar-nav">
                                    <Button className="nav-link navFontColor" href="#/event-list" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                        Your Events
                                </Button>
                                </ul>
                            }
                            {typeof this.state.name !== 'undefined' &&
                                <ul className="navbar-nav">
                                    <Button className="nav-link navFontColor" href="#/event-list" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                        {this.props.accounts.account.acc_username} Events
                                </Button>
                                </ul>
                            }
                            <ul className="navbar-nav">
                                <Button className="nav-link navFontColor" href="#/create-event" style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                    Create Your Event
                            </Button>
                            </ul>
                            {this.state.token !== null &&
                                <ul className="navbar-nav">
                                    <Button className="nav-link navFontColor"
                                        onClick={() => { this.signOut() }}
                                        style={{ backgroundColor: "rgb(250, 250, 250)" }}
                                    >
                                        Sign Out
                                    </Button>
                                </ul>
                            }
                            {this.state.token == null &&
                                <ul className="navbar-nav">
                                    <Button className="nav-link navFontColor"
                                        href="#/sign-in"
                                        style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                                        Sign In
                                    </Button>
                                </ul>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      accounts: state.accounts
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
      fetchAccountByID: (ownerID) => { dispatch(actionFetchAccountsByIDRequest(ownerID)) },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)


// export default (Navbar);