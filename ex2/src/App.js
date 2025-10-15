import React from 'react';

const appState = {
    allPokemons: [],
    filteredPokemons: [],
    selectedPokemon: null,
    loading: false,
    error: '',
    searchQuery: '',
    selectedTypes: [],
    allTypes: [],
    useCreateElement: false
};

let forceUpdateCallback = null;

export function setForceUpdate(callback) {
    forceUpdateCallback = callback;
}

function renderApp() {
    if (forceUpdateCallback) {
        forceUpdateCallback();
    }
}

async function loadPokemons() {
    try {
        appState.loading = true;
        renderApp();

        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        appState.allPokemons = data.results.map(pokemon => ({
            name: pokemon.name,
            url: pokemon.url
        }));

        appState.filteredPokemons = [...appState.allPokemons];
        appState.loading = false;
        renderApp();
    } catch (err) {
        console.error(err);
        showError('Nie udało się załadować Pokemonów');
        appState.loading = false;
        renderApp();
    }
}

async function loadTypes() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        appState.allTypes = data.results
            .filter(t => !['unknown', 'shadow'].includes(t.name))
            .map(t => t.name);
        renderApp();
    } catch (err) {
        console.error(err);
    }
}

async function loadPokemonDetails(nameOrUrl) {
    try {
        appState.loading = true;
        renderApp();

        const url = nameOrUrl.includes('http')
            ? nameOrUrl
            : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        appState.selectedPokemon = data;
        appState.loading = false;
        renderApp();
    } catch (err) {
        console.error(err);
        showError('Nie udało się załadować szczegółów Pokemona');
        appState.loading = false;
        renderApp();
    }
}

function showError(message) {
    appState.error = message;
    renderApp();
    setTimeout(() => {
        appState.error = '';
        renderApp();
    }, 5000);
}

function handleSearch(query) {
    appState.searchQuery = query.toLowerCase();
    filterPokemons();
}

function handleTypeToggle(type) {
    if (appState.selectedTypes.includes(type)) {
        appState.selectedTypes = appState.selectedTypes.filter(t => t !== type);
    } else {
        appState.selectedTypes = [...appState.selectedTypes, type];
    }
    filterPokemons();
}

function filterPokemons() {
    let filtered = [...appState.allPokemons];

    if (appState.searchQuery) {
        filtered = filtered.filter(pokemon => {
            const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
            return pokemon.name.includes(appState.searchQuery) ||
                pokemonId === appState.searchQuery;
        });
    }

    appState.filteredPokemons = filtered;
    renderApp();

    if (appState.selectedTypes.length > 0) {
        filterByTypesAsync();
    }
}

async function filterByTypesAsync() {
    const filtered = [];

    for (const pokemon of appState.filteredPokemons) {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            const pokemonTypes = data.types.map(t => t.type.name);

            const hasSelectedType = appState.selectedTypes.some(type =>
                pokemonTypes.includes(type)
            );

            if (hasSelectedType) {
                filtered.push(pokemon);
            }
        } catch (err) {
            console.error(err);
        }
    }

    appState.filteredPokemons = filtered;
    renderApp();
}

function toggleRenderMethod() {
    appState.useCreateElement = !appState.useCreateElement;
    renderApp();
}

function AppWrapper() {
    const [, setTick] = React.useState(0);

    React.useEffect(() => {
        setForceUpdate(() => setTick(t => t + 1));
        loadPokemons();
        loadTypes();
    }, []);

    return <App {...appState} />;
}

function App(props) {
    return (
        <div className="min-h-screen bg-gray-50">
            {props.loading && <LoadingIndicator />}
            {props.error && <ErrorMessage message={props.error} />}

            <Header useCreateElement={props.useCreateElement} />
            <Main {...props} />
            <Footer />
        </div>
    );
}

function LoadingIndicator() {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-700">Ładowanie...</p>
            </div>
        </div>
    );
}

function ErrorMessage(props) {
    return (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
            {props.message}
        </div>
    );
}

function Header(props) {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-center text-3xl font-bold mb-4">Biblioteka Pokemonów</h1>
                <div className="text-center">
                    <button
                        onClick={toggleRenderMethod}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                    >
                        {props.useCreateElement ? 'Używam: React.createElement' : 'Używam: JSX'}
                    </button>
                </div>
            </div>
        </header>
    );
}

function Main(props) {
    return (
        <main className="container mx-auto px-4 py-6">
            <SearchSection
                searchQuery={props.searchQuery}
                allTypes={props.allTypes || []}
                selectedTypes={props.selectedTypes || []}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PokemonsList
                    pokemons={props.filteredPokemons || []}
                    selectedPokemon={props.selectedPokemon}
                    useCreateElement={props.useCreateElement}
                />
                <PokemonDetails pokemon={props.selectedPokemon} />
            </div>
        </main>
    );
}

function SearchSection(props) {
    return (
        <div className="space-y-4 mb-6">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={props.searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Szukaj po nazwie lub numerze..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </section>

            {props.allTypes.length > 0 && (
                <section className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold text-gray-700 mb-3">Filtruj po typach:</h3>
                    <div className="flex flex-wrap gap-2">
                        {props.allTypes.map(type => (
                            <TypeFilter
                                key={type}
                                type={type}
                                isSelected={props.selectedTypes.includes(type)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function TypeFilter(props) {
    const typeColors = {
        normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
        electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
        fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
        flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
        rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-indigo-600',
        dark: 'bg-gray-800', steel: 'bg-gray-500', fairy: 'bg-pink-400'
    };

    return (
        <button
            onClick={() => handleTypeToggle(props.type)}
            className={`px-3 py-1 rounded-full text-white text-sm font-semibold transition ${
                typeColors[props.type] || 'bg-gray-400'
            } ${props.isSelected ? 'ring-4 ring-offset-2 ring-blue-400' : 'opacity-60 hover:opacity-100'}`}
        >
            {props.type}
        </button>
    );
}

function PokemonsList(props) {
    return (
        <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Lista Pokemonów ({props.pokemons.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {props.pokemons.map(pokemon => (
                    props.useCreateElement
                        ? <PokemonCardCreateElement
                            key={pokemon.name}
                            pokemon={pokemon}
                            isSelected={props.selectedPokemon && props.selectedPokemon.name === pokemon.name}
                        />
                        : <PokemonCardJSX
                            key={pokemon.name}
                            pokemon={pokemon}
                            isSelected={props.selectedPokemon && props.selectedPokemon.name === pokemon.name}
                        />
                ))}
            </div>
        </section>
    );
}

function PokemonCardJSX(props) {
    const pokemonId = props.pokemon.url.split('/').filter(Boolean).pop();

    return (
        <div onClick={() => loadPokemonDetails(props.pokemon.url)}
            className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                props.isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-500'
            }`}>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                alt={props.pokemon.name}
                className="w-24 h-24 mx-auto mb-2"
                onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                }}/>
            <h3 className="text-lg font-semibold text-gray-800 text-center capitalize">{props.pokemon.name}</h3>
            <p className="text-sm text-gray-500 text-center">#{pokemonId.padStart(3, '0')}</p>
        </div>
    );
}

function PokemonCardCreateElement(props) {
    const pokemonId = props.pokemon.url.split('/').filter(Boolean).pop();

    return React.createElement('div', {onClick: () => loadPokemonDetails(props.pokemon.url),
            className: `bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                props.isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-500'
            }`
        },
        React.createElement('img', {
            src: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
            alt: props.pokemon.name,
            className: 'w-24 h-24 mx-auto mb-2',
            onError: (e) => {
                e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
            }
        }),
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-800 text-center capitalize' },
            props.pokemon.name
        ),
        React.createElement('p', { className: 'text-sm text-gray-500 text-center' }, '#' + pokemonId.padStart(3, '0')
        )
    );
}

function PokemonDetails(props) {
    if (!props.pokemon) {
        return (
            <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>
                <div className="text-center text-gray-500">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                        className="w-24 h-24 mx-auto mb-4 opacity-50" alt="Pokeball"/>
                    <p>Kliknij na Pokemona<br/>aby zobaczyć szczegóły</p>
                </div>
            </section>
        );
    }

    const typeColors = {
        normal: 'bg-gray-400', fire: 'bg-red-500', water: 'bg-blue-500',
        electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-400',
        fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
        flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
        rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-indigo-600',
        dark: 'bg-gray-800', steel: 'bg-gray-500', fairy: 'bg-pink-400'
    };

    const totalStats = props.pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    return (
        <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>

            <div className="text-center mb-4">
                <img
                    src={props.pokemon.sprites.other['official-artwork'].front_default || props.pokemon.sprites.front_default}
                    alt={props.pokemon.name}
                    className="w-48 h-48 mx-auto mb-3"
                />
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{props.pokemon.name}</h3>
                <p className="text-gray-500 mb-2">#{String(props.pokemon.id).padStart(3, '0')}</p>

                <div className="flex gap-2 justify-center mb-4">
                    {props.pokemon.types.map(t => (
                        <span
                            key={t.type.name}
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${
                                typeColors[t.type.name] || 'bg-gray-400'
                            }`}
                        >
                            {t.type.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-700">Statystyki:</h4>
                    <span className="text-sm font-semibold text-blue-600">Suma: {totalStats}</span>
                </div>
                {props.pokemon.stats.map(stat => {
                    const percentage = Math.min((stat.base_stat / 255) * 100, 100);

                    let barColor = 'bg-red-500';
                    if (stat.base_stat >= 100) barColor = 'bg-green-500';
                    else if (stat.base_stat >= 60) barColor = 'bg-yellow-500';

                    return (
                        <div key={stat.stat.name} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-gray-700">
                                    {stat.stat.name.toUpperCase()}
                                </span>
                                <span className="text-gray-600">{stat.base_stat}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${barColor} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">Umiejętności:</h4>
                <div className="flex flex-wrap gap-2">
                    {props.pokemon.abilities.map(ability => (
                        <span
                            key={ability.ability.name}
                            className={`px-3 py-1 rounded-full text-sm ${
                                ability.is_hidden
                                    ? 'bg-purple-100 text-purple-800 border-2 border-purple-400 font-semibold'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            {ability.ability.name}
                            {ability.is_hidden && ' ★'}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-sm text-gray-500">Wzrost</p>
                    <p className="text-xl font-bold text-gray-800">
                        {(props.pokemon.height / 10).toFixed(1)} m
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500">Waga</p>
                    <p className="text-xl font-bold text-gray-800">
                        {(props.pokemon.weight / 10).toFixed(1)} kg
                    </p>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-12">
            <p className="text-center py-6 text-sm">
                © 2025 Biblioteka Pokemonów | Dane z PokeAPI
            </p>
        </footer>
    );
}

export default AppWrapper;