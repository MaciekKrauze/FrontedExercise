import { getTypeColor } from '../utils/typeColors';
import { calculateTotalStats, getStatPercentage, getStatBarColor, formatPokemonId, getFallbackImageUrl } from '../utils/pokemonFilters';

export default function PokemonDetails({ pokemon }) {
    if (!pokemon) {
        return (
            <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>
                <div className="text-center text-gray-500">
                    <img
                        src={getFallbackImageUrl()}
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                        alt="Pokeball"
                    />
                    <p>
                        Kliknij na Pokemona
                        <br />
                        aby zobaczyć szczegóły
                    </p>
                </div>
            </section>
        );
    }

    const totalStats = calculateTotalStats(pokemon.stats);

    return (
        <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Szczegóły</h2>

            <div className="text-center mb-4">
                <img
                    src={
                        pokemon.sprites.other['official-artwork'].front_default ||
                        pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto mb-3"
                />
                <h3 className="text-2xl font-bold text-gray-800 capitalize">
                    {pokemon.name}
                </h3>
                <p className="text-gray-500 mb-2">#{formatPokemonId(pokemon.id)}</p>

                <div className="flex gap-2 justify-center mb-4">
                    {pokemon.types.map(t => (
                        <span
                            key={t.type.name}
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${getTypeColor(
                                t.type.name
                            )}`}
                        >
              {t.type.name}
            </span>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-700">Statystyki:</h4>
                    <span className="text-sm font-semibold text-blue-600">
            Suma: {totalStats}
          </span>
                </div>
                {pokemon.stats.map(stat => {
                    const percentage = getStatPercentage(stat.base_stat);
                    const barColor = getStatBarColor(stat.base_stat);

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
                    {pokemon.abilities.map(ability => (
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
                        {(pokemon.height / 10).toFixed(1)} m
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500">Waga</p>
                    <p className="text-xl font-bold text-gray-800">
                        {(pokemon.weight / 10).toFixed(1)} kg
                    </p>
                </div>
            </div>
        </section>
    );
}