import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPokemonDetails, fetchPokemonList } from '@/services/pokemonService';
import PokemonDetails from '@/components/PokemonDetails';

// Generowanie statycznych ścieżek - SSG
export async function generateStaticParams() {
    const pokemons = await fetchPokemonList(50, 0);

    return pokemons.map((pokemon) => ({
        id: pokemon.url.split('/').filter(Boolean).pop(),
    }));
}

export default async function PokemonPage({ params }) {
    let pokemon;

    try {
        pokemon = await fetchPokemonDetails(params.id);
    } catch {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/"
                className="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
                ← Powrót do listy
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800">
                        ℹ️ Ta strona używa <strong>SSG z generateStaticParams</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        50 stron wygenerowanych podczas build time
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <PokemonDetails pokemon={pokemon} />
                </div>
            </div>
        </div>
    );
}