import React, { useState, useEffect } from 'react';

const App = () => {
    const [allPokemons, setAllPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadPokemons();
    }, []);

    const loadPokemons = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
            if (!response.ok) throw new Error(`HTTP ${response.status}. ${response.statusText}`);
            const data = await response.json();

            const pokemons = data.results.map(pokemon => ({
                name: pokemon.name || 'Nieznana nazwa',
                url: pokemon.url
            }));

            setAllPokemons(pokemons);
            setLoading(false);
        } catch (err) {
            console.log(err);
            showError('Nie udało się załadować Pokemonów');
            setLoading(false);
        }
    };

    const loadPokemonDetails = async (nameOrUrl) => {
        try {
            setLoading(true);
            const url = nameOrUrl.includes('http') ? nameOrUrl : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}. ${response.statusText}`);
            const data = await response.json();
            setLoading(false);
            return data;
        } catch (err) {
            console.log(err);
            setLoading(false);
            showError('Nie udało się załadować szczegółów Pokemona');
            return null;
        }
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    const handleSearch = async () => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return;

        const details = await loadPokemonDetails(query);
        if (details) {
            setSelectedPokemon(details);
        }
    };

    const handlePokemonClick = async (pokemon) => {
        const details = await loadPokemonDetails(pokemon.url);
        if (details) {
            setSelectedPokemon(details);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {loading && <LoadingIndicator />}
            {error && <ErrorMessage message={error} />}

            <Header />
            <Main
                pokemons={allPokemons}
                selectedPokemon={selectedPokemon}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handlePokemonClick={handlePokemonClick}
            />
            <Footer />
        </div>
    );
};

const LoadingIndicator = () => (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Ładowanie...</p>
        </div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
        {message}
    </div>
);

const Header = () => (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-center text-3xl font-bold">Biblioteka Pokemonów</h1>
        </div>
    </header>
);

const Main = ({ pokemons, selectedPokemon, searchQuery, setSearchQuery, handleSearch, handlePokemonClick }) => (
    <main className="container mx-auto px-4 py-6">
        <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PokemonsList pokemons={pokemons} onPokemonClick={handlePokemonClick} selectedPokemon={selectedPokemon} />
            <PokemonDetails pokemon={selectedPokemon} />
        </div>
    </main>
);

const SearchSection = ({ searchQuery, setSearchQuery, handleSearch }) => (
    <section className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex gap-2">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Szukaj pokemona po nazwie lub numerze..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Szukaj
            </button>
        </div>
    </section>
);

const PokemonsList = ({ pokemons, onPokemonClick, selectedPokemon }) => (
    <section className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lista Pokemonów</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pokemons.map((pokemon) => (
                <PokemonCard
                    key={pokemon.name}
                    pokemon={pokemon}
                    onClick={() => onPokemonClick(pokemon)}
                    isSelected={selectedPokemon && selectedPokemon.name === pokemon.name}
                />
            ))}
        </div>
    </section>
);

const PokemonCard = ({ pokemon, onClick, isSelected }) => {
    const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

    return (
        <div
            onClick={onClick}
            className={`bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-500'
            }`}
        >
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                alt={pokemon.name}
                className="w-24 h-24 mx-auto mb-2"
                onError={(e) => {
                    e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                }}
            />
            <h3 className="text-lg font-semibold text-gray-800 text-center capitalize">
                {pokemon.name}
            </h3>
            <p className="text-sm text-gray-500 text-center">
                #{pokemonId.padStart(3, '0')}
            </p>
        </div>
    );
};

const PokemonDetails = ({ pokemon }) => {
    if (!pokemon) {
        return (
            <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>
                <div className="text-center text-gray-500">
                    <img
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                        alt="Pokeball"
                    />
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

    return (
        <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>

            <div className="text-center mb-4">
                <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto mb-3"
                    onError={(e) => {
                        e.target.src = pokemon.sprites.front_default;
                    }}
                />
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{pokemon.name}</h3>
                <p className="text-gray-500 mb-2">#{String(pokemon.id).padStart(3, '0')}</p>

                <div className="flex gap-2 justify-center mb-4">
                    {pokemon.types.map((t) => (
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
                <h4 className="font-bold text-gray-700 mb-2">Statystyki:</h4>
                {pokemon.stats.map((stat) => {
                    const percentage = Math.min((stat.base_stat / 255) * 100, 100);
                    return (
                        <div key={stat.stat.name} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-gray-700">{stat.stat.name.toUpperCase()}</span>
                                <span className="text-gray-600">{stat.base_stat}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-sm text-gray-500">Wzrost</p>
                    <p className="text-xl font-bold text-gray-800">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500">Waga</p>
                    <p className="text-xl font-bold text-gray-800">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white mt-12">
        <p className="text-center py-6 text-sm">
            © 2025 Biblioteka Pokemonów | Dane z PokeAPI
        </p>
    </footer>
);

export default App;