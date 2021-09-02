import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider, responsiveFontSizes, CssBaseline } from '@material-ui/core';
import './index.css';
import App from './App.jsx';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux'
import { ToastProvider } from 'react-toast-notifications';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import store from './redux/store'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from "moment";
const theme = responsiveFontSizes(
  createTheme({
      palette: {
        primary: {
          main:"#03DAC5"
        },
        secondary:{
          main:"#fff"
        },
        background: {
          default: '#f8f8f8'
        }
      },
      typography:{
        fontFamily: [
          'Poppins',
          'Roboto'
        ].join(',')
      }
  })
)

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline/>
      <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Provider store={store}>
          <ToastProvider autoDismissTimeout={2000}>
      <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
           <App/>
       </MuiPickersUtilsProvider>
          </ToastProvider>
        </Provider>
        </Elements>
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
