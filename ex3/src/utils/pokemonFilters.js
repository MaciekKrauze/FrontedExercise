export function filterBySearch(pokemons, searchQuery) {
    if (!searchQuery) return pokemons;

    const query = searchQuery.toLowerCase();

    return pokemons.filter(pokemon => {
        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
        return pokemon.name.includes(query) || pokemonId === query;
    });
}

export function getPokemonId(url) {
    return url.split('/').filter(Boolean).pop();
}

export function formatPokemonId(id) {
    return String(id).padStart(3, '0');
}

export function getPokemonImageUrl(pokemonId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
}

export function getFallbackImageUrl() {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
}

export function calculateTotalStats(stats) {
    return stats.reduce((sum, stat) => sum + stat.base_stat, 0);
}

export function getStatPercentage(baseStat, max = 255) {
    return Math.min((baseStat / max) * 100, 100);
}

export function getStatBarColor(baseStat) {
    if (baseStat >= 100) return 'bg-green-500';
    if (baseStat >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
}