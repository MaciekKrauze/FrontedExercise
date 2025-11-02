import PokemonCard from './PokemonCard';

export default function PokemonsList({ pokemons }) {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Lista Pokemonów ({pokemons.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pokemons.map(pokemon => (
                    <PokemonCard key={pokemon.name} pokemon={pokemon} />
                ))}
            </div>
        </section>
    );
}