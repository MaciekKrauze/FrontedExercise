import { createElement } from 'react';
import Link from 'next/link';
import { getPokemonId, formatPokemonId, getPokemonImageUrl } from '@/utils/pokemonFilters';

export default function PokemonCardCreateElement({ pokemon }) {
    const pokemonId = getPokemonId(pokemon.url);

    return createElement(
        Link,
        {
            href: `/pokemon/${pokemonId}`,
            className: 'bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500'
        },
        createElement('img', {
            src: getPokemonImageUrl(pokemonId),
            alt: pokemon.name,
            className: 'w-24 h-24 mx-auto mb-2',
            loading: 'lazy'
        }),
        createElement(
            'h3',
            { className: 'text-lg font-semibold text-gray-800 text-center capitalize' },
            pokemon.name
        ),
        createElement(
            'p',
            { className: 'text-sm text-gray-500 text-center' },
            '#' + formatPokemonId(pokemonId)
        )
    );
}