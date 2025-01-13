import axios from "axios";
import API_KEY from "./api_key";
const progressBar = document.getElementById("progressBar");

// Global Defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Request Interceptor
axios.interceptors.request.use(config => {
  progressBar.style.width = "0%";
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
axios.interceptors.response.use(response => {
  const responseTime = new Date().getTime();
  const requestTime  = response.config.metadata.requestTime;
  console.log("Response time:", responseTime);
  console.log("Total duration:", responseTime - requestTime);
  return response;
}, (error) => {
  return Promise.reject(error);
});

function updateProgress(progressEvent) {
  progressBar.style.width = `${(progressEvent.progress * 100)}%`;
}

export async function getData(url) {
  console.log("New request...")
  try {
    const response = await axios.get(url, {
      onDownloadProgress: updateProgress
    });
    return response.data;
  } catch(error) {
    throw new Error(error);
  }
}
