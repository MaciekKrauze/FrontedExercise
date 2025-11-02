import { useState, useEffect } from 'react';
import pokemonService from './services/pokemonService';
import { filterBySearch } from './utils/pokemonFilters';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import SearchSection from './components/SearchSection';
import PokemonsList from './components/PokemonsList';
import PokemonDetails from './components/PokemonDetails';

export default function App() {
    const [allPokemons, setAllPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [useCreateElement, setUseCreateElement] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedTypes, allPokemons]);

    async function loadInitialData() {
        try {
            setLoading(true);
            const [pokemons, types] = await Promise.all([
                pokemonService.fetchPokemons(50, 0),
                pokemonService.fetchTypes()
            ]);

            setAllPokemons(pokemons);
            setFilteredPokemons(pokemons);
            setAllTypes(types);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function applyFilters() {
        let filtered = filterBySearch(allPokemons, searchQuery);

        if (selectedTypes.length > 0) {
            setLoading(true);
            filtered = await pokemonService.fetchPokemonsByTypes(
                filtered,
                selectedTypes
            );
            setLoading(false);
        }

        setFilteredPokemons(filtered);
    }

    async function handlePokemonClick(url) {
        try {
            setLoading(true);
            const data = await pokemonService.fetchPokemonDetails(url);
            setSelectedPokemon(data);
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(query) {
        setSearchQuery(query.toLowerCase());
    }

    function handleTypeToggle(type) {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    }

    function handleToggleRenderMethod() {
        setUseCreateElement(prev => !prev);
    }

    function showError(message) {
        setError(message);
        setTimeout(() => setError(''), 5000);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {loading && <LoadingIndicator />}
            {error && <ErrorMessage message={error} />}

            <Header
                useCreateElement={useCreateElement}
                onToggleRenderMethod={handleToggleRenderMethod}
            />

            <main className="container mx-auto px-4 py-6">
                <SearchSection
                    searchQuery={searchQuery}
                    allTypes={allTypes}
                    selectedTypes={selectedTypes}
                    onSearch={handleSearch}
                    onTypeToggle={handleTypeToggle}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <PokemonsList
                        pokemons={filteredPokemons}
                        selectedPokemon={selectedPokemon}
                        useCreateElement={useCreateElement}
                        onPokemonClick={handlePokemonClick}
                    />
                    <PokemonDetails pokemon={selectedPokemon} />
                </div>
            </main>

            <Footer />
        </div>
    );
}