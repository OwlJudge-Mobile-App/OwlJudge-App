import axios from "axios";

// Setting up an axios instance for easy requests
const api = axios.create({
  baseURL: "http://192.168.12.202:3000", //Server-ip-address
  timeout: 10000,
});

export default api;
