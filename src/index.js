import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import appReducers from './reducers/reducer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";



const store = createStore(
    appReducers,
    composeWithDevTools(applyMiddleware(thunk))
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));
