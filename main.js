const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let limit = 8;
let offset = 1;
let isSearching = false;

previous.addEventListener("click", () => {
  if (offset > 1) {
    offset -= 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

next.addEventListener("click", () => {
  offset += 9;
  removeChildNodes(pokemonContainer);
  fetchPokemons(offset, limit);
});

function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i < offset + limit; i++) {
    fetchPokemon(i);
  }
}

function fetchPokemon(idOrName) {
  spinner.style.display = "block";
  fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}/`)
    .then((res) => {
      if (!res.ok) {
        if (isSearching) {
          alert("Pokémon no encontrado. Inténtalo nuevamente.");
          spinner.style.display = "none";
        }
        return;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        createPokemon(data);
        spinner.style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error al buscar el Pokémon:", error);
      alert("Hubo un error al buscar el Pokémon.");
      spinner.style.display = "none";
    });
}

function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(progressBars(pokemon.stats));

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);
}

function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {
    const stat = stats[i];

    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

// Evento para buscar Pokémon al presionar el botón de búsqueda
searchButton.addEventListener("click", searchPokemon);

// Evento para buscar Pokémon al presionar "Enter"
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    searchPokemon();
  }
});

// Evento para actualizar automáticamente cuando el campo de búsqueda queda vacío
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    // Si el campo está vacío, restaurar la lista original de Pokémon
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

// Función para buscar el Pokémon o restablecer la lista
function searchPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  isSearching = true;
  removeChildNodes(pokemonContainer);
  
  if (searchTerm) {
    fetchPokemon(searchTerm);
  } else {
    fetchPokemons(offset, limit);
  }
}
