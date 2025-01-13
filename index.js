import * as Carousel from "./Carousel.js";
import { fetchData } from "./utils/fetch.js";
import { getData } from "./utils/axios.js";
import API_KEY from "./utils/api_key.js";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const progressBar = document.getElementById("progressBar");

export async function favourite(imgId) {
  // your code here
}

// Step 1
async function initialLoad() {
  // breeds = await fetchData(`https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`);
  const breeds = await getData("/breeds");
  
  breeds.forEach(breed => {
    if (breed.image) {
      const option = document.createElement("option");
      option.setAttribute("value", breed.id);
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    }
  });

  renderUI(breedSelect.value);
}
initialLoad();


// Step 2
breedSelect.addEventListener("change", handleSelect);

async function handleSelect(e) {
  renderUI(e.target.value);
}

async function renderUI(breedID) {
  Carousel.clear();
  infoDump.innerHTML = '';
  const breedData = await getData(`/images/search?breed_ids=${breedID}&limit=10`);
  populateCarousel(breedData);
  renderBreedInfo(breedData[0].breeds[0]);
  Carousel.start();
}

function populateCarousel(catArray) {
  catArray.forEach(cat => {
    const carouselItem = Carousel.createCarouselItem(cat.url, "cat image", cat.id);
    Carousel.appendCarousel(carouselItem);
  });
}

function renderBreedInfo(breedInfo) {
  infoDump.innerHTML = `
    <div>
      <h3>${breedInfo.name}</h3>
      <p>
        The ${breedInfo.name} is a breed known for its curiosity, intelligence, and communication skills. ${breedInfo.description}
        They score ${breedInfo.adaptability}/5 for adaptability, ${breedInfo.affection_level}/5 for affection, and ${breedInfo.energy_level}/5 for energy levels. They are child-friendly (${breedInfo.child_friendly}/5) and dog-friendly (${breedInfo.dog_friendly}/5).
        With a lifespan of ${breedInfo.life_span} years, moderate grooming needs (${breedInfo.grooming}/5), and a hypoallergenic coat (${breedInfo.hypoallergenic === 1 ? "Yes" : "No"}), they are a relatively low-maintenance breed.
      </p>
    </div>
  `;
}
