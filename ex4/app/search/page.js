import Link from 'next/link';
import { searchPokemon, fetchTypes } from '@/services/pokemonService';
import { formatPokemonId } from '@/utils/pokemonFilters';

// KRYTYCZNE: Force SSR
export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }) {
    const { name, type } = searchParams;
    const types = await fetchTypes();

    let results = [];
    let hasSearched = false;

    if (name || type) {
        hasSearched = true;
        results = await searchPokemon(name, type);
    }

    // Timestamp - dowód że to SSR
    const renderTime = new Date().toLocaleString('pl-PL', {
        timeZone: 'Europe/Warsaw',
    });

    return (
        <div className="space-y-6">
            <Link
                href="/"
                className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
                ← Powrót do strony głównej
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    🔍 Wyszukiwarka Pokemonów
                </h1>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-orange-800">
                        ℹ️ Ta strona używa <strong>SSR (Server-Side Rendering)</strong>
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                        📅 Renderowana: <strong>{renderTime}</strong>
                    </p>
                    <p className="text-xs text-orange-600">
                        Odśwież stronę - timestamp się zmieni! 🔄
                    </p>
                </div>

                <form method="GET" className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nazwa Pokemona:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={name || ''}
                            placeholder="np. pikachu"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                            Typ:
                        </label>
                        <select
                            id="type"
                            name="type"
                            defaultValue={type || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Wybierz typ --</option>
                            {types.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                        Szukaj
                    </button>
                </form>
            </div>

            {hasSearched && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Wyniki wyszukiwania ({results.length})
                    </h2>

                    {results.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg">😔 Nie znaleziono Pokemonów</p>
                            <p className="text-sm mt-2">Spróbuj innego zapytania</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.map((pokemon) => (
                                <Link
                                    key={pokemon.id}
                                    href={`/pokemon/${pokemon.id}`}
                                    className="bg-gray-50 p-4 rounded-lg hover:shadow-lg transition border-2 border-transparent hover:border-blue-500"
                                >
                                    <img
                                        src={pokemon.sprites.other['official-artwork'].front_default}
                                        alt={pokemon.name}
                                        className="w-24 h-24 mx-auto mb-2"
                                    />
                                    <h3 className="text-lg font-semibold text-gray-800 text-center capitalize">
                                        {pokemon.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        #{formatPokemonId(pokemon.id)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}