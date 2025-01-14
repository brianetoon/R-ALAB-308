import axios from "axios";
import API_KEY from "./api_key";

const progressBar = document.getElementById("progressBar");
const body = document.querySelector("body");

// Global Defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Request Interceptor
axios.interceptors.request.use(config => {
  const startTime = new Date().getTime();
  progressBar.style.width = "0%";
  body.style.cursor = "progress";
  config.metadata = {
    startTime
  };
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
axios.interceptors.response.use(response => {
  const endTime = new Date().getTime();
  const startTime  = response.config.metadata.startTime;
  body.style.cursor = "default";
  console.log("Response time:", endTime - startTime);
  return response;
}, (error) => {
  return Promise.reject(error);
});

function updateProgress(progressEvent) {
  progressBar.style.width = `${(progressEvent.progress * 100)}%`;
}

export async function getData(url) {
  console.log("New GET request...");

  try {
    const response = await axios.get(url, {
      onDownloadProgress: updateProgress
    });
    return response.data;

  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function handleFavourite(imgId) {

  const favourites = await getFavourites();
  // return favourite if it is already in favourites
  const favourite = favourites.find(fav => fav.image_id === imgId);

  try {

    if (favourite) {
      console.log("Deleted favourite")
      const deletedFavourite = await axios.delete(`/favourites/${favourite.id}`);
      return deletedFavourite;
    } else {
      console.log("Added favourite")
      const newFavourite = await axios.post("/favourites", {
        image_id: imgId
      });
      return newFavourite;
    }

  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getFavourites() {
  console.log("New GET request...");

  try {
    const response = await axios.get("/favourites", {
      onDownloadProgress: updateProgress
    });
    return response.data;

  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
}
