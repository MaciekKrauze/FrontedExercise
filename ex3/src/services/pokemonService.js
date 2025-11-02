class PokemonService {
    constructor() {
        this.baseUrl = 'https://pokeapi.co/api/v2';
    }

    async fetchPokemons(limit = 50, offset = 0) {
        try {
            const response = await fetch(
                `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.results.map(pokemon => ({
                name: pokemon.name,
                url: pokemon.url
            }));
        } catch (error) {
            console.error('Error fetching pokemons:', error);
            throw new Error('Nie udało się załadować Pokemonów');
        }
    }

    async fetchTypes() {
        try {
            const response = await fetch(`${this.baseUrl}/type`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.results
                .filter(t => !['unknown', 'shadow'].includes(t.name))
                .map(t => t.name);
        } catch (error) {
            console.error('Error fetching types:', error);
            throw new Error('Nie udało się załadować typów');
        }
    }

    async fetchPokemonDetails(nameOrUrl) {
        try {
            const url = nameOrUrl.includes('http')
                ? nameOrUrl
                : `${this.baseUrl}/pokemon/${nameOrUrl}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching pokemon details:', error);
            throw new Error('Nie udało się załadować szczegółów Pokemona');
        }
    }

    async fetchPokemonsByTypes(pokemons, selectedTypes) {
        const filtered = [];

        for (const pokemon of pokemons) {
            try {
                const data = await this.fetchPokemonDetails(pokemon.url);
                const pokemonTypes = data.types.map(t => t.type.name);

                const hasSelectedType = selectedTypes.some(type =>
                    pokemonTypes.includes(type)
                );

                if (hasSelectedType) {
                    filtered.push(pokemon);
                }
            } catch (error) {
                console.error('Error filtering by type:', error);
            }
        }

        return filtered;
    }
}

export default new PokemonService();