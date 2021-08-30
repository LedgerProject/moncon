import axios from 'axios';
import firebaseService from './firebaseService';
import { LS_KEY_TOKEN } from '../Constants';

const apiService = axios.create({
  baseURL: process.env.REACT_APP_MONCON_API_BASE_URL,
});

// TODO: Check if there is a better way to pass Authorization header
apiService.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem(LS_KEY_TOKEN)}`;
  return config;
},error => {
	console.log('request error')
	console.log(error)
	return Promise.reject(error);
});

apiService.interceptors.response.use(response => {
  return response;
},error => {
	const originalRequest = error.config
	if(error.response.status === 401 && !originalRequest._retry){
    originalRequest._retry = true;
    const user = firebaseService.auth().currentUser
    if(!user) {	
    	return Promise.reject(error); 
    }
    return user.getIdToken(true).then((idToken) => {
      localStorage.setItem(LS_KEY_TOKEN,idToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(LS_KEY_TOKEN)}`;
      return axios(originalRequest)
    });
  }else if(error.response.status === 401 && originalRequest._retry){
  	window.location.reload()
  }
     return Promise.reject(error);
});
export default apiService;
