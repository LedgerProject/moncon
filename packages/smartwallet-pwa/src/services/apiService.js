import axios from "axios";
const apiService = axios.create({
    baseURL: process.env.REACT_APP_MONCON_API_BASE_URL,
  });

export default apiService