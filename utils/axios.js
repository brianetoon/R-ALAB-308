import axios from "axios";
import API_KEY from "./api_key";

const axiosInstance = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
  headers: {
    'x-api-key' : API_KEY
  }
})

export async function getData(url) {
  try {
    const response = await axiosInstance.get(url);
    console.log(response);
    return response.data;
  } catch(error) {
    throw new Error(error);
  }
}