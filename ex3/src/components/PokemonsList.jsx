import PokemonCard from './PokemonCard';
import PokemonCardCreateElement from './PokemonCardCreateElement';

export default function PokemonsList({
                                         pokemons,
                                         selectedPokemon,
                                         useCreateElement,
                                         onPokemonClick
                                     }) {
    return (
        <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Lista Pokemonów ({pokemons.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pokemons.map(pokemon => {
                    const CardComponent = useCreateElement
                        ? PokemonCardCreateElement
                        : PokemonCard;

                    return (
                        <CardComponent
                            key={pokemon.name}
                            pokemon={pokemon}
                            isSelected={
                                selectedPokemon && selectedPokemon.name === pokemon.name
                            }
                            onClick={onPokemonClick}
                        />
                    );
                })}
            </div>
        </section>
    );
}