import React from "react";
//import ReactDOM from "react-dom";
const ReactDOM = require("react-dom");
import {Provider} from "react-redux";
import {createStore, compose, applyMiddleware} from "redux";
import logger from "redux-logger";
import thunk from 'redux-thunk';

import reducers from "./reducers";

import View from "./App";


const store = createStore(reducers,
    compose(
        applyMiddleware(
            thunk,
            logger
        )
    )
);

ReactDOM.render(
    <Provider store={store}>
        <View />
    </Provider>
  , document.getElementById("start")
);

