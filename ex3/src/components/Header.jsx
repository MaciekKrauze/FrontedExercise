export default function Header({ useCreateElement, onToggleRenderMethod }) {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-center text-3xl font-bold mb-4">
                    Biblioteka Pokemonów
                </h1>
                <div className="text-center">
                    <button
                        onClick={onToggleRenderMethod}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                    >
                        {useCreateElement ? 'Używam: React.createElement' : 'Używam: JSX'}
                    </button>
                </div>
            </div>
        </header>
    );
}