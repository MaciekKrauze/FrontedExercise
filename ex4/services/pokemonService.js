const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 50, offset = 0) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
        next: { revalidate: 86400 } // Cache 24h
    });

    if (!response.ok) {
        throw new Error('Nie udało się załadować Pokemonów');
    }

    const data = await response.json();
    return data.results.map(pokemon => ({
        name: pokemon.name,
        url: pokemon.url
    }));
}

export async function fetchPokemonDetails(id) {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`, {
        next: { revalidate: 86400 }
    });

    if (!response.ok) {
        throw new Error('Nie udało się załadować szczegółów Pokemona');
    }

    return response.json();
}

export async function fetchTypes() {
    const response = await fetch(`${BASE_URL}/type`);

    if (!response.ok) {
        throw new Error('Nie udało się załadować typów');
    }

    const data = await response.json();
    return data.results
        .filter(t => !['unknown', 'shadow'].includes(t.name))
        .map(t => t.name);
}

export async function searchPokemon(name, type) {
    let pokemons = [];

    if (name) {
        try {
            const details = await fetchPokemonDetails(name.toLowerCase());
            return [details];
        } catch {
            return [];
        }
    } else if (type) {
        const response = await fetch(`${BASE_URL}/type/${type}`, {
            cache: 'no-store' // SSR
        });

        if (!response.ok) return [];

        const data = await response.json();
        pokemons = data.pokemon
            .slice(0, 20)
            .map(p => p.pokemon);
    } else {
        pokemons = await fetchPokemonList(20, 0);
    }

    const details = await Promise.all(
        pokemons.map(async (p) => {
            const id = p.url.split('/').filter(Boolean).pop();
            return fetchPokemonDetails(id);
        })
    );

    return details;
}