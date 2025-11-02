import { createElement } from 'react';
import { getPokemonId, formatPokemonId, getPokemonImageUrl, getFallbackImageUrl } from '../utils/pokemonFilters';

export default function PokemonCardCreateElement({ pokemon, isSelected, onClick }) {
    const pokemonId = getPokemonId(pokemon.url);

    return createElement(
        'div',
        {
            onClick: () => onClick(pokemon.url),
            className: `bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent hover:border-blue-500'
            }`
        },
        createElement('img', {
            src: getPokemonImageUrl(pokemonId),
            alt: pokemon.name,
            className: 'w-24 h-24 mx-auto mb-2',
            onError: (e) => {
                e.target.src = getFallbackImageUrl();
            }
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