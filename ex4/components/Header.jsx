import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <Link href="/">
                    <h1 className="text-center text-3xl font-bold mb-2 cursor-pointer hover:opacity-90 transition">
                        Biblioteka Pokemonów
                    </h1>
                </Link>
                <div className="flex justify-center gap-4 text-sm">
                    <Link href="/" className="hover:underline">
                        🏠 Strona główna (SSG)
                    </Link>
                    <Link href="/search" className="hover:underline">
                        🔍 Wyszukiwarka (SSR)
                    </Link>
                </div>
            </div>
        </header>
    );
}