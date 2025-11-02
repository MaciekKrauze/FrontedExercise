let allPokemons = [];
let selectedPokemon = null;


async function loadPokemons() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
        if (!response.ok) throw new Error(`HTTP ${response.status}. ${response.statusText}`);
        const data = await response.json();

        allPokemons = data.results.map(pokemon => ({
            name: pokemon.name || 'Nieznana nazwa',
            url: pokemon.url
        }));

        return allPokemons;
    }
    catch (error) {
        console.log(error);
        showError('Nie udało się załadować Pokemonów');
        return [];
    }
}

async function loadPokemonDetails(nameOrUrl) {
    try {
        showLoading(true);
        const url = nameOrUrl.includes('http') ? nameOrUrl : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}. ${response.statusText}`);
        const data = await response.json();
        showLoading(false);
        return data;
    }
    catch (error) {
        console.log(error);
        showLoading(false);
        showError('Nie udało się załadować szczegółów Pokemona');
        return null;
    }
}

function showLoading(show) {
    let loader = document.getElementById('loading-indicator');
    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'loading-indicator';
        loader.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50';
        loader.innerHTML = `
            <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p class="text-gray-700">Ładowanie...</p>
            </div>
        `;
        document.body.appendChild(loader);
    } else if (loader && !show) {
        loader.remove();
    }
}

function showError(message) {
    const existingError = document.getElementById('error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
    errorDiv.innerText = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}

function createHeader() {
    const header = document.createElement('header');
    header.className = 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg';

    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 py-6';

    const h1 = document.createElement('h1');
    h1.innerText = 'Biblioteka Pokemonów';
    h1.className = 'text-center text-3xl font-bold';

    container.appendChild(h1);
    header.appendChild(container);
    document.body.appendChild(header);
}

function createMain(list) {
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4 py-6';

    const searchSection = document.createElement('section');
    searchSection.id = 'search-section';
    searchSection.className = 'bg-white p-4 rounded-lg shadow-md mb-6';
    searchSection.append(createSearchSection(list));

    const contentGrid = document.createElement('div');
    contentGrid.className = 'grid grid-cols-1 lg:grid-cols-3 gap-6';

    const pokemonsListSection = document.createElement('section');
    pokemonsListSection.id = 'pokemons-list-section';
    pokemonsListSection.className = 'lg:col-span-2';

    const listTitle = document.createElement('h2');
    listTitle.innerText = 'Lista Pokemonów';
    listTitle.className = 'text-2xl font-bold mb-4 text-gray-800';

    const pokemonGrid = document.createElement('div');
    pokemonGrid.id = 'pokemon-grid';
    pokemonGrid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    pokemonGrid.append(...createPokemonsListSection(list));

    pokemonsListSection.append(listTitle, pokemonGrid);

    const detailsSection = document.createElement('section');
    detailsSection.id = 'pokemon-details-section';
    detailsSection.className = 'lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit';
    detailsSection.innerHTML = `
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>
        <div id="pokemon-details" class="text-center text-gray-500">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-24 h-24 mx-auto mb-4 opacity-50">
            <p>Kliknij na Pokemona<br>aby zobaczyć szczegóły</p>
        </div>
    `;

    contentGrid.append(pokemonsListSection, detailsSection);
    main.append(searchSection, contentGrid);
    document.body.appendChild(main);
}

function createSearchSection(list) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'flex gap-2';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'search-input';
    input.placeholder = 'Szukaj pokemona po nazwie lub numerze...';
    input.className = 'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

    const button = document.createElement('button');
    button.innerText = 'Szukaj';
    button.id = 'search-button';
    button.className = 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition';

    // Obsługa wyszukiwania
    const handleSearch = async () => {
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        const details = await loadPokemonDetails(query);
        if (details) {
            displayPokemonDetails(details);
        }
    };

    button.addEventListener('click', handleSearch);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    searchContainer.append(input, button);
    return searchContainer;
}

function createPokemonsListSection(list) {
    return list.map(pokemon => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500';

        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        img.alt = pokemon.name;
        img.className = 'w-24 h-24 mx-auto mb-2';
        img.onerror = () => {
            img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
        };

        const name = document.createElement('h3');
        name.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        name.className = 'text-lg font-semibold text-gray-800 text-center';

        const idText = document.createElement('p');
        idText.innerText = `#${pokemonId.padStart(3, '0')}`;
        idText.className = 'text-sm text-gray-500 text-center';

        card.addEventListener('click', async () => {
            document.querySelectorAll('#pokemon-grid > div').forEach(c => {
                c.classList.remove('border-blue-500', 'bg-blue-50');
            });

            card.classList.add('border-blue-500', 'bg-blue-50');

            const details = await loadPokemonDetails(pokemon.url);
            if (details) {
                displayPokemonDetails(details);
            }
        });

        card.append(img, name, idText);
        return card;
    });
}


function displayPokemonDetails(pokemon) {
    const detailsContainer = document.getElementById('pokemon-details');

    const types = pokemon.types.map(t => {
        const typeColors = {
            normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
            electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
            fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
            flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
            rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-indigo-600',
            dark: 'bg-gray-800', steel: 'bg-gray-500', fairy: 'bg-pink-400'
        };

        return `<span class="inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${typeColors[t.type.name] || 'bg-gray-400'}">${t.type.name}</span>`;
    }).join(' ');

    const stats = pokemon.stats.map(stat => {
        const percentage = Math.min((stat.base_stat / 255) * 100, 100);
        return `
            <div class="mb-3">
                <div class="flex justify-between text-sm mb-1">
                    <span class="font-semibold text-gray-700">${stat.stat.name.toUpperCase()}</span>
                    <span class="text-gray-600">${stat.base_stat}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    detailsContainer.innerHTML = `
        <div class="text-center mb-4">
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}"
                 class="w-48 h-48 mx-auto mb-3"
                 onerror="this.src='${pokemon.sprites.front_default}'">
            <h3 class="text-2xl font-bold text-gray-800 capitalize">${pokemon.name}</h3>
            <p class="text-gray-500 mb-2">#${String(pokemon.id).padStart(3, '0')}</p>
            <div class="flex gap-2 justify-center mb-4">${types}</div>
        </div>
        
        <div class="mb-4">
            <h4 class="font-bold text-gray-700 mb-2">Statystyki:</h4>
            ${stats}
        </div>
        
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div class="text-center">
                <p class="text-sm text-gray-500">Wzrost</p>
                <p class="text-xl font-bold text-gray-800">${(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div class="text-center">
                <p class="text-sm text-gray-500">Waga</p>
                <p class="text-xl font-bold text-gray-800">${(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
        </div>
    `;
}


function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'bg-gray-800 text-white mt-12';

    const p = document.createElement('p');
    p.innerText = '© 2025 Biblioteka Pokemonów | Dane z PokeAPI';
    p.className = 'text-center py-6 text-sm';

    footer.appendChild(p);
    document.body.appendChild(footer);
}


window.addEventListener('DOMContentLoaded', async (event) => {
    showLoading(true);

    const pokemons_list = await loadPokemons();
    showLoading(false);

    if (pokemons_list.length > 0) {
        createHeader();
        createMain(pokemons_list);
        createFooter();
    } else {
        showError('Nie udało się załadować danych. Odśwież stronę.');
    }
});