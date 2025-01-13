import axios from "axios";
import API_KEY from "./api_key";

const axiosInstance = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: {
    "x-api-key" : API_KEY
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(config => {
  const requestTime = new Date().getTime();
  console.log("Request time:", requestTime);
  config.metadata = {
    requestTime
  };
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
axiosInstance.interceptors.response.use(response => {
  const responseTime = new Date().getTime();
  const requestTime  = response.config.metadata.requestTime;
  console.log("Response time:", responseTime);
  console.log("Total duration:", responseTime - requestTime);
  return response;
}, (error) => {
  return Promise.reject(error);
});

export async function getData(url) {
  console.log("New request...")
  try {
    const response = await axiosInstance.get(url);
    // console.log(response);
    return response.data;
  } catch(error) {
    throw new Error(error);
  }
}
