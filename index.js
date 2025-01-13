import * as Carousel from "./Carousel.js";
import API_KEY from "./utils/api_key.js";
import { fetchData } from "./utils/fetch.js";
import { 
  getData, 
  getFavourites, 
  handleFavourite 
} from "./utils/axios.js";

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

initialLoad();

// Retrieve all favourites
getFavouritesBtn.addEventListener("click", renderFavorites);

// Favourite an image
export async function favourite(imgId) {
  handleFavourite(imgId);
}

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

  renderBreed(breedSelect.value);
}

breedSelect.addEventListener("change", handleSelect);

async function handleSelect(e) {
  renderBreed(e.target.value);
}

async function renderBreed(breedId) {
  Carousel.clear();
  infoDump.innerHTML = '';
  const breedData = await getData(`/images/search?breed_ids=${breedId}&limit=10`);
  populateCarousel(breedData);
  renderBreedInfo(breedData[0].breeds[0]);
  Carousel.start();
}

async function renderFavorites() {
  const favourites = await getFavourites();

  let formattedFavourites = [];
  favourites.forEach(fav => {
    formattedFavourites.push(fav.image);
  });

  Carousel.clear();
  infoDump.innerHTML = `<h3 class="text-center">😻 Your Favourite Cats 😻</h3>`;
  populateCarousel(formattedFavourites);
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
