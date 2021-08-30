import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
      primary: {
        main:"#1c1c1c"
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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme} >
      <CssBaseline/> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
