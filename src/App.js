import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Routes from './components/Routes';
import Navbar from './components/Navbar'        



class App extends Component {

    render() {
        return (
            <div className="bckgrd">
                <Router>
                    <Navbar/>
                    <Route path='/' component={Routes}></Route>
                </Router>
            </div>
        );
    }
};

export default App;
