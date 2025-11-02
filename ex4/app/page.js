import Link from 'next/link';
import { fetchPokemonList, fetchTypes } from '@/services/pokemonService';
import PokemonsList from '@/components/PokemonsList';
import SearchSection from '@/components/SearchSection';

export default async function Home() {
  // SSG - fetch podczas build time
  const pokemons = await fetchPokemonList(50, 0);
  const types = await fetchTypes();

  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              ℹ️ Ta strona używa <strong>SSG (Static Site Generation)</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Wygenerowana podczas build time - super szybka! ⚡
            </p>
          </div>
        </div>

        <SearchSection selectedTypes={[]} allTypes={types} />

        <PokemonsList pokemons={pokemons} />
      </div>
  );
}